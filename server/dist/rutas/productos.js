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
const ProductoCtrl = __importStar(require("../controladores/productos"));
const rutasProductos = express_1.Router();
rutasProductos.get('/obtenerProductos/:id', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerProductos);
rutasProductos.get('/obtenerProductosPorCantidad/:id', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerProductosPorCantidad);
rutasProductos.get('/obtenerProductosPorTam/:id', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerProductosPorTam);
rutasProductos.get('/familias', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerFamilias);
rutasProductos.get('/buscarProductoPorTam/:ancho/:alto', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.buscarProductoPorTam);
rutasProductos.get('/obtenerFamiliasYProductos', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerFamiliasYProductos);
//post
rutasProductos.post('/buscarProducto', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.buscarProducto);
exports.default = rutasProductos;
