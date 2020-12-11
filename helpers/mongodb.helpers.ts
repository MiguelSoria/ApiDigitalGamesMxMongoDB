import { MongoClient, MongoClientOptions } from 'mongodb';
import settings from '../settings';

export default class MongoDBHelper {

    public db: any;
    public stateConection: string = '';
    private static _instace: MongoDBHelper;
    private cnn: any;
    private dbUri: string;
    constructor(isAuth: boolean = false) {
        if (isAuth) {
            this.dbUri = `mongodb://${settings.mongodb.userName}:${settings.mongodb.password}@${settings.mongodb.host}:${settings.mongodb.port}`;

        } else {
            this.dbUri = `mongodb://${settings.mongodb.host}:${settings.mongodb.port}`;
        }

    };
    public static getInstance(isAuth: boolean = false) {
        return this._instace || (this._instace = new this(isAuth));

    }
    public async connect(dataBase: string, options: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true }) {
        const result = await MongoClient.connect(this.dbUri, options)
            .then((cnn: any) => {
                return { status: 'success', cnn, err: null, msg: 'Conexion a MongoDB REALIZADA DE FORMA CORRECTA !!!' };
            })
            .catch((err: any) => {
                return { status: 'error', cnn: null, err, msg: 'Ocurrio un error al intentar establecer conexión con MongoDB' };
            });

        this.stateConection = result.status;
        if (result.status === 'success') {
            console.log(`Servidor MongoDB corriendo en puerto ${settings.mongodb.port}`);

            this.cnn = result.cnn;
            this.db = this.cnn.db(dataBase);
        } else {
            this.cnn = null;
            this.db = null;
        }
    }
    public setDataBase(dataBase: string) {
        this.db = this.cnn.db(dataBase);
    }
    public async disconect() {
        this.cnn.close();
    }

}