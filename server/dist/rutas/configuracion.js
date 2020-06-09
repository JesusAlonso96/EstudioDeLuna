"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ConfiguracionCtrl = __importStar(require("../controladores/configuracion"));
const middlewares_1 = require("../middlewares/middlewares");
const storage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
        cb(null, './subidas/logotipos');
    }
}), upload = multer_1.default({ storage: storage });
const rutasConfiguracion = express_1.Router();
//rutasConfiguracion.get('/logotipo', autenticacionMiddleware, ConfiguracionCtrl.obtenerLogotipo);
rutasConfiguracion.get('', middlewares_1.autenticacionMiddleware, ConfiguracionCtrl.obtenerConfiguracionUsuario);
rutasConfiguracion.patch('/notificaciones', middlewares_1.autenticacionMiddleware, ConfiguracionCtrl.guardarConfiguracionNotificaciones);
rutasConfiguracion.patch('/temas', middlewares_1.autenticacionMiddleware, ConfiguracionCtrl.cambiarTema);
exports.default = rutasConfiguracion;
