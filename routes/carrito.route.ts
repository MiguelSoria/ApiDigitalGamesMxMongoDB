import { Router, Request, Response, NextFunction } from 'express';
import mongoClient from 'mongodb';
import MongoDBHelper from '../helpers/mongodb.helpers'
import settings from '../settings';
import paginate from 'jw-paginate';



const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    code: 200,
    enviroment: settings.api.enviroment,
    msg: 'API User works Successfully !!'

  });
});
api.get('/getAll/:pageNumber/:pagesize/:criterio', async (req: Request, res: Response, next: NextFunction) => {
  const { pageNumber, pagesize, criterio } = req.params;

  mongo.setDataBase('dbmtwdm');

  const skips = parseInt(pagesize) * (parseInt(pageNumber) - 1);
  const data: any[] = [];
  let result = {
    totalRows: 0,
    data,
    pager: {}
  }
  const search = new RegExp(criterio);
  const count: any = await mongo.db.collection('carrito').find({ idUsuario: search }).toArray();
  result.totalRows = count.length;
  result.data = await mongo.db.collection('carrito').find({ idUsuario: search }).limit(parseInt(pagesize)).toArray();

  result.pager = paginate(result.totalRows, parseInt(pageNumber), parseInt(pagesize), 5);
  res.status(200).json({
    status: 'success',
    enviroment: settings.api.enviroment,
    msg: `Se obtuvieron resultados para el critero ${criterio}`,
    data: result

  });
});
api.post('/add', async (req: Request, res: Response, next: NextFunction) => {
  const { idUsuario, idproducto, cantidad } = req.body;  
  
  //Insert datos carrito on MongoDB
  const result: any = await mongo.db.collection('carrito').insertOne({    
    idUsuario, idproducto, cantidad
  })
    .then((result: any) => {
      return {
        uid: result.insertedtId,
        rowsAffected: result.insertedCount
      }
    })
    .catch((err: any) => {
      return err;
    });
  res.status(201).json({
    uid: result.uid,
    idUsuario,
    idproducto,
    cantidad,
    rowsAffected: result.rowsAffected
  });
});
api.put('/edit', async (req: Request, res: Response, next: NextFunction) => {

  const { uid, cantidad } = req.body;
  const _id = new mongoClient.ObjectID(uid);
  mongo.setDataBase('dbmtwdm');
  const carrito: any = await mongo.db.collection('carrito').findOneAndUpdate(
    { _id },
    {
      $set: { cantidad }
    }
  );
  res.status(200).json({
    status: 'success',
    enviroment: settings.api.enviroment,
    msg: `se modifico correctamente la cantidad`,
    data: carrito

  });
});
api.delete('/remove', async (req: Request, res: Response, next: NextFunction) => {
  // to do logic Remove with findOneAndUpdate
  const {uid,cantidad} = req.body;
  const _id = new mongoClient.ObjectID(uid);
  mongo.setDataBase('dbmtwdm');
  const carrito: any = await mongo.db.collection('carrito').remove({_id});

  res.status(200).json({
    status: 'success',
    enviroment: settings.api.enviroment,
    msg: `Se elimino producto del carrito con id ${uid}`,
    data: carrito

  });
});

export default api;