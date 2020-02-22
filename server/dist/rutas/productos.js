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
const ProductoCtrl = __importStar(require("../controladores/productos"));
const rutasProductos = express_1.Router();
rutasProductos.get('/obtenerProductos/:id', ProductoCtrl.obtenerProductos);
rutasProductos.get('/obtenerProductosPorCantidad/:nombre', ProductoCtrl.obtenerProductosPorCantidad);
rutasProductos.get('/obtenerProductosPorTam/:nombre', ProductoCtrl.obtenerProductosPorTam);
rutasProductos.get('/familias', ProductoCtrl.obtenerFamilias);
rutasProductos.get('/buscarProductoPorTam/:ancho/:alto', ProductoCtrl.buscarProductoPorTam);
rutasProductos.get('/obtenerFamiliasYProductos', ProductoCtrl.obtenerFamiliasYProductos);
//post
rutasProductos.post('/buscarProducto', ProductoCtrl.buscarProducto);
exports.default = rutasProductos;
