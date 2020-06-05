"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares/middlewares");
const ProductoCtrl = __importStar(require("../controladores/productos"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname + '.jpeg');
    },
    destination: function (req, file, cb) {
        cb(null, './subidas');
    }
}), upload = multer_1.default({ storage: storage });
const rutasProductos = express_1.Router();
rutasProductos.get('/obtenerProductos/:id', middlewares_1.autenticacionMiddleware, ProductoCtrl.obtenerProductos);
rutasProductos.get('/obtenerProductosPorCantidad/:id', middlewares_1.autenticacionMiddleware, ProductoCtrl.obtenerProductosPorCantidad);
rutasProductos.get('/obtenerProductosPorTam/:id', middlewares_1.autenticacionMiddleware, ProductoCtrl.obtenerProductosPorTam);
rutasProductos.get('/familias', middlewares_1.autenticacionMiddleware, ProductoCtrl.obtenerFamilias);
rutasProductos.get('/buscarProductoPorTam/:ancho/:alto', middlewares_1.autenticacionMiddleware, ProductoCtrl.buscarProductoPorTam);
rutasProductos.get('/obtenerFamiliasYProductos', middlewares_1.autenticacionMiddleware, ProductoCtrl.obtenerFamiliasYProductos);
//post
rutasProductos.post('/buscarProducto', middlewares_1.autenticacionMiddleware, ProductoCtrl.buscarProducto);
rutasProductos.post('', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, ProductoCtrl.guardarProducto);
//patch
rutasProductos.patch('/:idProducto', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, upload.single('imagen'), ProductoCtrl.actualizarFotoProducto);
exports.default = rutasProductos;
