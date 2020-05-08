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
const InventarioCtrl = __importStar(require("../controladores/inventario"));
const middlewares_1 = require("../middlewares/middlewares");
const rutasInventario = express_1.Router();
/* GET */
//rutasInventario.get('/eliminados', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenesEliminados);
rutasInventario.get('/:id', middlewares_1.autenticacionMiddleware, InventarioCtrl.obtenerInventarioPorId);
rutasInventario.get('', middlewares_1.autenticacionMiddleware, InventarioCtrl.obtenerInventarios);
/* POST */
rutasInventario.post('', middlewares_1.autenticacionMiddleware, InventarioCtrl.nuevoInventario);
/* PUT */
//rutasInventario.put('/:id', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.editarAlmacen);
/* PATCH */
//rutasInventario.patch('/:id/restauracion', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.restaurar);
//rutasInventario.patch('/:id/eliminar', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);
exports.default = rutasInventario;
