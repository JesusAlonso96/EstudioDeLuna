import {Router} from 'express';
import * as AlmacenCtrl from '../controladores/almacen';
import * as UsuarioCtrl from '../controladores/usuario';


const rutasAlmacen = Router();
/* GET */
rutasAlmacen.get('/eliminados', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenesEliminados);
rutasAlmacen.get('/:id', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenPorId);
rutasAlmacen.get('', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenes );
/* POST */
rutasAlmacen.post('', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.nuevoAlmacen);
/* PUT */
rutasAlmacen.put('/:id', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.editarAlmacen);
/* PATCH */
rutasAlmacen.patch('/:id/restauracion', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.restaurar);
rutasAlmacen.patch('/:id/eliminar', UsuarioCtrl.autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);

export default rutasAlmacen;