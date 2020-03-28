"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioCtrl = __importStar(require("../controladores/usuario"));
const ConfiguracionCtrl = __importStar(require("../controladores/configuracion"));
const rutasConfiguracion = express_1.Router();
rutasConfiguracion.get('', UsuarioCtrl.autenticacionMiddleware, ConfiguracionCtrl.obtenerConfiguracionUsuario);
rutasConfiguracion.patch('/notificaciones', UsuarioCtrl.autenticacionMiddleware, ConfiguracionCtrl.guardarConfiguracionNotificaciones);
exports.default = rutasConfiguracion;
