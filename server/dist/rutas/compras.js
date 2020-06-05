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
const ComprasCtrl = __importStar(require("../controladores/compras"));
const middlewares_1 = require("../middlewares/middlewares");
const rutasCompras = express_1.Router();
/* GET */
rutasCompras.get('/sin-registrar', middlewares_1.autenticacionMiddleware, ComprasCtrl.obtenerComprasSinRegistrar);
/* POST */
/* PUT */
/* PATCH */
exports.default = rutasCompras;
