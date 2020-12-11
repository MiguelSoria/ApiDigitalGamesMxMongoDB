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
const mongodb_helpers_1 = __importDefault(require("../helpers/mongodb.helpers"));
const settings_1 = __importDefault(require("../settings"));
const api = express_1.Router();
const mongo = mongodb_helpers_1.default.getInstance();
api.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        code: 200,
        enviroment: settings_1.default.api.enviroment,
        msg: 'API User works Successfully !!!'
    });
});
api.post('/add', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, fullName, photo } = req.body;
    //Insert User on MongoDB
    const result = yield mongo.db.collection('user').insertOne({
        email, password, fullName, photo
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
        email,
        fullName,
        photo,
        rowsAffected: result
    });
}));
exports.default = api;
