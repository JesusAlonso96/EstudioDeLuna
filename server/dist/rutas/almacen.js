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
const UsuarioCtrl = __importStar(require("../controladores/usuario"));
const rutasAlmacen = express_1.Router();
/* GET */
rutasAlmacen.get('/eliminados', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenesEliminados);
rutasAlmacen.get('/:id', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenPorId);
rutasAlmacen.get('', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenes);
/* POST */
rutasAlmacen.post('', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.nuevoAlmacen);
/* PUT */
rutasAlmacen.put('/:id', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.editarAlmacen);
/* PATCH */
rutasAlmacen.patch('/:id/restauracion', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.restaurar);
rutasAlmacen.patch('/:id/eliminar', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);
exports.default = rutasAlmacen;
