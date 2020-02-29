"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DatosCtrl = __importStar(require("../controladores/datos_estudio"));
const UsuarioCtrl = __importStar(require("../controladores/usuario"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const storage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, crypto_1.default.createHash('sha256').update(file.originalname).digest('base64') + '.jpeg');
    },
    destination: function (req, file, cb) {
        cb(null, './subidas/logo');
    }
}), upload = multer_1.default({ storage });
const rutasDatos = express_1.Router();
//get
rutasDatos.get('', UsuarioCtrl.autenticacionMiddleware, DatosCtrl.obtenerDatos);
exports.default = rutasDatos;