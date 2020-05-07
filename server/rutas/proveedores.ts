import { Router } from 'express';
import * as ProveedoresCtrl from '../controladores/proveedores';
import { autenticacionMiddleware, rootMiddleware,adminORootMiddleware } from '../middlewares/middlewares';
const rutasProveedores = Router();

//get
rutasProveedores.get('/insumos/:id', autenticacionMiddleware, adminORootMiddleware, ProveedoresCtrl.obtenerProductosProveedor);
rutasProveedores.get('/insumos/eliminados', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.obtenerProductosProveedorEliminados);
rutasProveedores.get('/eliminados', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.obtenerProveedoresEliminados);
rutasProveedores.get('/lista', autenticacionMiddleware, adminORootMiddleware, ProveedoresCtrl.obtenerListaProveedores);
rutasProveedores.get('', autenticacionMiddleware, adminORootMiddleware, ProveedoresCtrl.obtenerProveedores);

//post
rutasProveedores.post('/insumo', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.agregarProductoProveedor);
rutasProveedores.post('', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.nuevoProveedor);
//put
rutasProveedores.put('', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.editarProveedor);

//patch
rutasProveedores.patch('/insumo/eliminar', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.eliminarProductoProveedor);
rutasProveedores.patch('/insumo/restaurar', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.restaurarProductoProveedorEliminado);
rutasProveedores.patch('/eliminar', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.eliminarProveedor);
rutasProveedores.patch('/restaurar', autenticacionMiddleware, rootMiddleware, ProveedoresCtrl.restaurarProveedor);


export default rutasProveedores;