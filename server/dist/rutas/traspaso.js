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
const TraspasoCtrl = __importStar(require("../controladores/traspaso"));
const middlewares_1 = require("../middlewares/middlewares");
const rutasTraspaso = express_1.Router();
/* GET */
rutasTraspaso.get('/pendientes', middlewares_1.autenticacionMiddleware, TraspasoCtrl.obtenerTraspasosPendientes);
/* POST */
rutasTraspaso.post('', middlewares_1.autenticacionMiddleware, TraspasoCtrl.nuevoTraspaso);
/* PUT */
/* PATCH */
rutasTraspaso.patch('/:id/estado', middlewares_1.autenticacionMiddleware, TraspasoCtrl.editarEstadoTraspaso);
rutasTraspaso.patch('/:id', middlewares_1.autenticacionMiddleware, TraspasoCtrl.eliminarTraspaso);
exports.default = rutasTraspaso;
