import { Router } from 'express';
import { autenticacionMiddleware } from '../middlewares/middlewares';
import * as ProductoCtrl from '../controladores/productos';
const rutasProductos = Router();

rutasProductos.get('/obtenerProductos/:id', autenticacionMiddleware, ProductoCtrl.obtenerProductos);
rutasProductos.get('/obtenerProductosPorCantidad/:id', autenticacionMiddleware, ProductoCtrl.obtenerProductosPorCantidad);
rutasProductos.get('/obtenerProductosPorTam/:id', autenticacionMiddleware, ProductoCtrl.obtenerProductosPorTam);
rutasProductos.get('/familias', autenticacionMiddleware, ProductoCtrl.obtenerFamilias);
rutasProductos.get('/buscarProductoPorTam/:ancho/:alto', autenticacionMiddleware, ProductoCtrl.buscarProductoPorTam)
rutasProductos.get('/obtenerFamiliasYProductos', autenticacionMiddleware, ProductoCtrl.obtenerFamiliasYProductos)
//post
rutasProductos.post('/buscarProducto', autenticacionMiddleware,ProductoCtrl.buscarProducto);

export default rutasProductos;