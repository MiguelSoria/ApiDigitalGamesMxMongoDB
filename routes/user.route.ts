import {NextFunction , Request, Response, Router } from 'express';
import MongoDBHelper from '../helpers/mongodb.helpers'
import settings from '../settings';
import fileUpload, { UploadedFile } from 'express-fileupload';

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
api.post('/upload', async(req: Request, res: Response, next: NextFunction) => {

  if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
          status: 'Bad Request',
          code: 400,
          environment: settings.api.enviroment,
          msg: `Es necesario adjuntar por lo menos 1 archivos`
      });
  }
  
  // // Multiples Archivos en un Arreglo
  // let files:any = req.files.attachments;

  // files.forEach((file:any) => {
  //     file.mv(`./uploads/${file.name}`, (err: any) => {
  //         if (err) {
  //             return res.status(500).json({
  //                 status: 'Internal Server Error',
  //                 code: 500,
  //                 environment: settings.api.enviroment,
  //                 msg: `Ocurrio un error al intentar guardar el archivo en el servidor`
  //             });
  //         }
  //     });    
  // });


     //Un solo archivo
     let fileError = req.files.error as UploadedFile;
     // // Use the mv() method to place the file somewhere on your server
      fileError.mv(`./uploads/${fileError.name}`, (err: any) => {
          if (err) {
             return res.status(500).json({
              status: 'Internal Server Error',
                 code: 500,
                 environment: settings.api.enviroment,
                 msg: `Ocurrio un error al intentar guardar el archivo en el servidor`
             });
        }
     });   
 
     res.status(200).json({
         status: 'success',
         code: 200,
         environment: settings.api.enviroment,
         msg: `El archivo se cargo de forma correcta`
     });    
 
});
export default api;