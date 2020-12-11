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
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const mongodb_helpers_1 = __importDefault(require("./helpers/mongodb.helpers"));
const settings_1 = __importDefault(require("./settings"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const carrito_route_1 = __importDefault(require("./routes/carrito.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
//MongoDB Connect
const mongo = mongodb_helpers_1.default.getInstance();
//Express App
const app = express_1.default();
//Serialization JSON Format
app.use(express_1.default.json());
//file Upload
app.use(express_fileupload_1.default({
    limits: { fileSize: 50 * 1024 * 1024 }
}));
// CORS Enabled
app.use(cors_1.default({ origin: true, credentials: true }));
//Routes for API
app.use('/v1/product', product_route_1.default);
app.use('/v1/carrito', carrito_route_1.default);
app.use('/v1/auth', auth_route_1.default);
app.use('/v1/user', user_route_1.default);
//start servers
const startServers = () => __awaiter(void 0, void 0, void 0, function* () {
    //Connect to Mongo DB
    yield mongo.connect('dbmtwdm');
    //Listen Express server
    if (mongo.stateConection === 'success') {
        app.listen(settings_1.default.api.port, () => {
            console.log(`Servisor Express corriendo en puerto ${settings_1.default.api.port}`);
        });
    }
    else {
        console.log('Lo sentimos no se puede arrancar el servidor express hasta que arranque MongoDB');
    }
});
//Execute startServers Function
startServers();
