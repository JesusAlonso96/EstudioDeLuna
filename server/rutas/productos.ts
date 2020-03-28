import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import * as ProductoCtrl from '../controladores/productos';
const rutasProductos = Router();

rutasProductos.get('/obtenerProductos/:id', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerProductos);
rutasProductos.get('/obtenerProductosPorCantidad/:id', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerProductosPorCantidad);
rutasProductos.get('/obtenerProductosPorTam/:id', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerProductosPorTam);
rutasProductos.get('/familias', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerFamilias);
rutasProductos.get('/buscarProductoPorTam/:ancho/:alto', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.buscarProductoPorTam)
rutasProductos.get('/obtenerFamiliasYProductos', UsuarioCtrl.autenticacionMiddleware, ProductoCtrl.obtenerFamiliasYProductos)
//post
rutasProductos.post('/buscarProducto', UsuarioCtrl.autenticacionMiddleware,ProductoCtrl.buscarProducto);

export default rutasProductos;