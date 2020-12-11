import express, { Request, Response } from 'express';
import MongoHelper from './helpers/mongodb.helpers';
import settings from './settings';
import apiProduct from './routes/product.route';
import apiCarrito from './routes/carrito.route';
import apiAuth from './routes/auth.route';
import apiUser from './routes/user.route';

//MongoDB Connect
const mongo = MongoHelper.getInstance();

//Express App
const app = express();
//Serialization JSON Format
app.use(express.json());

//Routes for API
app.use('/v1/product', apiProduct);
app.use('/v1/carrito', apiCarrito);
app.use('/v1/auth', apiAuth);
app.use('/v1/user', apiUser);

//start servers
const startServers = async () => {
    //Connect to Mongo DB
   await mongo.connect('dbmtwdm');
    //Listen Express server
    if(mongo.stateConection==='success'){
        app.listen(settings.api.port, () => {
            console.log(`Servisor Express corriendo en puerto ${settings.api.port}`);
        });

    }else{
        console.log('Lo sentimos no se puede arrancar el servidor express hasta que arranque MongoDB')
    }
    
};
//Execute startServers Function
startServers();
