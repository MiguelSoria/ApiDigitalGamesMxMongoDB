import { Router, Request, Response, NextFunction } from 'express';
import MongoDBHelper from '../helpers/mongodb.helpers'
import settings from '../settings';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    code: 200,
    enviroment: settings.api.enviroment,
    msg: 'API User works Successfully !!!'

  });
});

api.post('/add', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, fullName, photo } = req.body;
  //Insert User on MongoDB
  const result:any = await mongo.db.collection('user').insertOne({
    email, password, fullName, photo
  })
    .then((result: any) => {
      return{
        uid:result.insertedtId,
        rowsAffected:result.insertedCount
      }
    })
    .catch((err:any)=>{
      return err;
    });
    res.status(201).json({
       uid:result.uid,
        email,
        fullName,
        photo,
        rowsAffected:result       

    });
});
export default api;