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
rutasAlmacen.get('/:id/movimientos/:idMovimiento', middlewares_1.autenticacionMiddleware, AlmacenCtrl.obtenerMovimientoAlmacenPorId);
rutasAlmacen.get('/historial-movimientos', middlewares_1.autenticacionMiddleware, AlmacenCtrl.obtenerHistorialMovimientos);
rutasAlmacen.get('/eliminados', middlewares_1.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenesEliminados);
rutasAlmacen.get('/:id', middlewares_1.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenPorId);
rutasAlmacen.get('', middlewares_1.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenes);
/* POST */
rutasAlmacen.post('', middlewares_1.autenticacionMiddleware, AlmacenCtrl.nuevoAlmacen);
/* PUT */
rutasAlmacen.put('/:id', middlewares_1.autenticacionMiddleware, AlmacenCtrl.editarAlmacen);
/* PATCH */
rutasAlmacen.patch('/:id/insumos/:idInsumo', middlewares_1.autenticacionMiddleware, AlmacenCtrl.editarInsumoAlmacen);
rutasAlmacen.patch('/:id/restauracion', middlewares_1.autenticacionMiddleware, AlmacenCtrl.restaurar);
rutasAlmacen.patch('/:id/eliminar', middlewares_1.autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);
rutasAlmacen.patch('/:id/restauracion', middlewares_1.autenticacionMiddleware, AlmacenCtrl.restaurar);
rutasAlmacen.patch('/:id/eliminar', middlewares_1.autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);
rutasAlmacen.patch('/:id/insumos', middlewares_1.autenticacionMiddleware, AlmacenCtrl.editarInsumosAlmacen);
exports.default = rutasAlmacen;
