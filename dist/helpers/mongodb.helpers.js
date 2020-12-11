"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const settings_1 = __importDefault(require("../settings"));
class MongoDBHelper {
    constructor(isAuth = false) {
        this.stateConection = '';
        if (isAuth) {
            this.dbUri = `mongodb://${settings_1.default.mongodb.userName}:${settings_1.default.mongodb.password}@${settings_1.default.mongodb.host}:${settings_1.default.mongodb.port}`;
        }
        else {
            this.dbUri = `mongodb://${settings_1.default.mongodb.host}:${settings_1.default.mongodb.port}`;
        }
    }
    ;
    static getInstance(isAuth = false) {
        return this._instace || (this._instace = new this(isAuth));
    }
    connect(dataBase, options = { useNewUrlParser: true, useUnifiedTopology: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.MongoClient.connect(this.dbUri, options)
                .then((cnn) => {
                return { status: 'success', cnn, err: null, msg: 'Conexion a MongoDB REALIZADA DE FORMA CORRECTA !!!' };
            })
                .catch((err) => {
                return { status: 'error', cnn: null, err, msg: 'Ocurrio un error al intentar establecer conexión con MongoDB' };
            });
            this.stateConection = result.status;
            if (result.status === 'success') {
                console.log(`Servidor MongoDB corriendo en puerto ${settings_1.default.mongodb.port}`);
                this.cnn = result.cnn;
                this.db = this.cnn.db(dataBase);
            }
            else {
                this.cnn = null;
                this.db = null;
            }
        });
    }
    setDataBase(dataBase) {
        this.db = this.cnn.db(dataBase);
    }
    disconect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cnn.close();
        });
    }
}
exports.default = MongoDBHelper;
