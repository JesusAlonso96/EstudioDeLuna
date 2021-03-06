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
const EstadosCtrl = __importStar(require("../controladores/estados"));
const rutasEstados = express_1.Router();
rutasEstados.get('/estados', EstadosCtrl.obtenerEstados);
rutasEstados.get('/municipios/:id', EstadosCtrl.obtenerMunicipios);
exports.default = rutasEstados;
