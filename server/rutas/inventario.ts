import {Router} from 'express';
import * as InventarioCtrl from '../controladores/inventario';
import * as UsuarioCtrl from '../controladores/usuario';
import { autenticacionMiddleware } from '../middlewares/middlewares';


const rutasInventario = Router();
/* GET */
//rutasInventario.get('/eliminados', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenesEliminados);
rutasInventario.get('/:id', autenticacionMiddleware, InventarioCtrl.obtenerInventarioPorId);
rutasInventario.get('', autenticacionMiddleware, InventarioCtrl.obtenerInventarios );
/* POST */
rutasInventario.post('', autenticacionMiddleware, InventarioCtrl.nuevoInventario);
/* PUT */
//rutasInventario.put('/:id', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.editarAlmacen);
/* PATCH */
//rutasInventario.patch('/:id/restauracion', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.restaurar);
//rutasInventario.patch('/:id/eliminar', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);

export default rutasInventario;