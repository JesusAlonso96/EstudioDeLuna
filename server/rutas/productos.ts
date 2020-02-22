import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import * as ProductoCtrl from '../controladores/productos';
const rutasProductos = Router();

rutasProductos.get('/obtenerProductos/:id', ProductoCtrl.obtenerProductos);
rutasProductos.get('/obtenerProductosPorCantidad/:nombre', ProductoCtrl.obtenerProductosPorCantidad);
rutasProductos.get('/obtenerProductosPorTam/:nombre', ProductoCtrl.obtenerProductosPorTam);
rutasProductos.get('/familias', ProductoCtrl.obtenerFamilias );
rutasProductos.get('/buscarProductoPorTam/:ancho/:alto', ProductoCtrl.buscarProductoPorTam)
rutasProductos.get('/obtenerFamiliasYProductos', ProductoCtrl.obtenerFamiliasYProductos)
//post
rutasProductos.post('/buscarProducto', ProductoCtrl.buscarProducto);

export default rutasProductos;