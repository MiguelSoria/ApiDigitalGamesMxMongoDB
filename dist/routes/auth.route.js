"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_1 = __importDefault(require("../settings"));
const api = express_1.Router();
api.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        code: 200,
        enviroment: settings_1.default.api.enviroment,
        msg: 'API Auth Works Successfully !!!'
    });
});
exports.default = api;
