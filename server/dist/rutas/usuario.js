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
const rutasUsuario = express_1.Router();
rutasUsuario.post('/login', UsuarioCtrl.login);
rutasUsuario.post('/crearAsistencia/:id', UsuarioCtrl.crearAsistencia);
exports.default = rutasUsuario;
