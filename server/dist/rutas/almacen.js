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
const AlmacenCtrl = __importStar(require("../controladores/almacen"));
const middlewares_1 = require("../middlewares/middlewares");
const rutasAlmacen = express_1.Router();
/* GET */
rutasAlmacen.get('/eliminados', middlewares_1.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenesEliminados);
rutasAlmacen.get('/:id', middlewares_1.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenPorId);
rutasAlmacen.get('', middlewares_1.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenes);
/* POST */
rutasAlmacen.post('', middlewares_1.autenticacionMiddleware, AlmacenCtrl.nuevoAlmacen);
/* PUT */
rutasAlmacen.put('/:id', middlewares_1.autenticacionMiddleware, AlmacenCtrl.editarAlmacen);
/* PATCH */
rutasAlmacen.patch('/:id/restauracion', middlewares_1.autenticacionMiddleware, AlmacenCtrl.restaurar);
rutasAlmacen.patch('/:id/eliminar', middlewares_1.autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);
exports.default = rutasAlmacen;
