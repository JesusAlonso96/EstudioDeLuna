import { Router } from 'express';
import { autenticacionMiddleware, adminOSupervisorMiddleware } from '../middlewares/middlewares';
import * as ProductoCtrl from '../controladores/productos';
import { adminMiddleware } from '../controladores/admin';
const rutasProductos = Router();

rutasProductos.get('/obtenerProductosPorCantidad/:id', autenticacionMiddleware, ProductoCtrl.obtenerProductosPorCantidad);
rutasProductos.get('/obtenerProductosPorTam/:id', autenticacionMiddleware, ProductoCtrl.obtenerProductosPorTam);
rutasProductos.get('/familias', autenticacionMiddleware, ProductoCtrl.obtenerFamilias);
rutasProductos.get('/buscarProductoPorTam/:ancho/:alto', autenticacionMiddleware, ProductoCtrl.buscarProductoPorTam);
rutasProductos.get('/familias-productos/inactivos', autenticacionMiddleware, ProductoCtrl.obtenerFamiliasYProductosInactivos)
rutasProductos.get('/familias-productos', autenticacionMiddleware, ProductoCtrl.obtenerFamiliasYProductos)
rutasProductos.get('/:idFamilia/inactivos', autenticacionMiddleware, ProductoCtrl.obtenerProductosInactivos);
rutasProductos.get('/:idFamilia', autenticacionMiddleware, ProductoCtrl.obtenerProductos);

//post
rutasProductos.post('/buscarProducto', autenticacionMiddleware, ProductoCtrl.buscarProducto);
rutasProductos.post('', autenticacionMiddleware, adminOSupervisorMiddleware, ProductoCtrl.guardarProducto);

//patch
rutasProductos.patch('/:idProducto', autenticacionMiddleware, adminMiddleware, ProductoCtrl.restaurarProducto);

export default rutasProductos;