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
const SucursalCtrl = __importStar(require("../controladores/sucursal"));
const middlewares_1 = require("../middlewares/middlewares");
const rutasSucursal = express_1.Router();
/* GET */
rutasSucursal.get('/:id/almacenes', middlewares_1.autenticacionMiddleware, SucursalCtrl.obtenerAlmacenesSucursal);
rutasSucursal.get('', middlewares_1.autenticacionMiddleware, SucursalCtrl.obtenerSucursales);
/* POST */
/* PUT */
/* PATCH */
exports.default = rutasSucursal;
