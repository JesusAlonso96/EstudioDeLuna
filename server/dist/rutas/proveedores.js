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
const ProveedoresCtrl = __importStar(require("../controladores/proveedores"));
const middlewares_1 = require("../middlewares/middlewares");
const rutasProveedores = express_1.Router();
//get
rutasProveedores.get('/insumos/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminORootMiddleware, ProveedoresCtrl.obtenerProductosProveedor);
rutasProveedores.get('/insumos/eliminados', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.obtenerProductosProveedorEliminados);
rutasProveedores.get('/eliminados', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.obtenerProveedoresEliminados);
rutasProveedores.get('/lista', middlewares_1.autenticacionMiddleware, middlewares_1.adminORootMiddleware, ProveedoresCtrl.obtenerListaProveedores);
rutasProveedores.get('', middlewares_1.autenticacionMiddleware, middlewares_1.adminORootMiddleware, ProveedoresCtrl.obtenerProveedores);
//post
rutasProveedores.post('/insumo', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.agregarProductoProveedor);
rutasProveedores.post('', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.nuevoProveedor);
//put
rutasProveedores.put('', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.editarProveedor);
//patch
rutasProveedores.patch('/insumo/eliminar', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.eliminarProductoProveedor);
rutasProveedores.patch('/insumo/restaurar', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.restaurarProductoProveedorEliminado);
rutasProveedores.patch('/eliminar', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.eliminarProveedor);
rutasProveedores.patch('/restaurar', middlewares_1.autenticacionMiddleware, middlewares_1.rootMiddleware, ProveedoresCtrl.restaurarProveedor);
exports.default = rutasProveedores;
