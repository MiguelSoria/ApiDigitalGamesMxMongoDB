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
const express_1 = require("express");
const mongodb_1 = __importDefault(require("mongodb"));
const mongodb_helpers_1 = __importDefault(require("../helpers/mongodb.helpers"));
const settings_1 = __importDefault(require("../settings"));
const jw_paginate_1 = __importDefault(require("jw-paginate"));
const api = express_1.Router();
const mongo = mongodb_helpers_1.default.getInstance();
api.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        code: 200,
        enviroment: settings_1.default.api.enviroment,
        msg: 'API User works Successfully !!'
    });
});
api.get('/getAll/:pageNumber/:pagesize/:criterio', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageNumber, pagesize, criterio } = req.params;
    mongo.setDataBase('dbmtwdm');
    const skips = parseInt(pagesize) * (parseInt(pageNumber) - 1);
    const data = [];
    let result = {
        totalRows: 0,
        data,
        pager: {}
    };
    const search = new RegExp(criterio);
    const count = yield mongo.db.collection('carrito').find({ idUsuario: search }).toArray();
    result.totalRows = count.length;
    result.data = yield mongo.db.collection('carrito').find({ idUsuario: search }).limit(parseInt(pagesize)).toArray();
    result.pager = jw_paginate_1.default(result.totalRows, parseInt(pageNumber), parseInt(pagesize), 5);
    res.status(200).json({
        status: 'success',
        enviroment: settings_1.default.api.enviroment,
        msg: `Se obtuvieron resultados para el critero ${criterio}`,
        data: result
    });
}));
api.post('/add', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idUsuario, idproducto, cantidad } = req.body;
    //Insert datos carrito on MongoDB
    const result = yield mongo.db.collection('carrito').insertOne({
        idUsuario, idproducto, cantidad
    })
        .then((result) => {
        return {
            uid: result.insertedtId,
            rowsAffected: result.insertedCount
        };
    })
        .catch((err) => {
        return err;
    });
    res.status(201).json({
        uid: result.uid,
        idUsuario,
        idproducto,
        cantidad,
        rowsAffected: result.rowsAffected
    });
}));
api.put('/edit', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, cantidad } = req.body;
    const _id = new mongodb_1.default.ObjectID(uid);
    mongo.setDataBase('dbmtwdm');
    const carrito = yield mongo.db.collection('carrito').findOneAndUpdate({ _id }, {
        $set: { cantidad }
    });
    res.status(200).json({
        status: 'success',
        enviroment: settings_1.default.api.enviroment,
        msg: `se modifico correctamente la cantidad`,
        data: carrito
    });
}));
api.delete('/remove', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // to do logic Remove with findOneAndUpdate
    const { uid, cantidad } = req.body;
    const _id = new mongodb_1.default.ObjectID(uid);
    mongo.setDataBase('dbmtwdm');
    const carrito = yield mongo.db.collection('carrito').deleteOne({ _id });
    res.status(200).json({
        status: 'success',
        enviroment: settings_1.default.api.enviroment,
        msg: `Se elimino producto del carrito con id ${uid}`,
        data: carrito
    });
}));
exports.default = api;
