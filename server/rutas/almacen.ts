import { Router } from 'express';
import * as AlmacenCtrl from '../controladores/almacen';
import { autenticacionMiddleware } from '../middlewares/middlewares';

const rutasAlmacen = Router();
/* GET */
rutasAlmacen.get('/:id/movimientos/:idMovimiento', autenticacionMiddleware, AlmacenCtrl.obtenerMovimientoAlmacenPorId);
rutasAlmacen.get('/historial-movimientos', autenticacionMiddleware, AlmacenCtrl.obtenerHistorialMovimientos);
rutasAlmacen.get('/eliminados', autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenesEliminados);
rutasAlmacen.get('/:id', autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenPorId);
rutasAlmacen.get('', autenticacionMiddleware, AlmacenCtrl.obtenerAlmacenes);
/* POST */
rutasAlmacen.post('', autenticacionMiddleware, AlmacenCtrl.nuevoAlmacen);
/* PUT */
rutasAlmacen.put('/:id', autenticacionMiddleware, AlmacenCtrl.editarAlmacen);
/* PATCH */
rutasAlmacen.patch('/:id/insumos/:idInsumo', autenticacionMiddleware, AlmacenCtrl.editarInsumoAlmacen);
rutasAlmacen.patch('/:id/restauracion', autenticacionMiddleware, AlmacenCtrl.restaurar);
rutasAlmacen.patch('/:id/eliminar', autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);
rutasAlmacen.patch('/:id/restauracion', autenticacionMiddleware, AlmacenCtrl.restaurar);
rutasAlmacen.patch('/:id/eliminar', autenticacionMiddleware, AlmacenCtrl.eliminarAlmacen);
rutasAlmacen.patch('/:id/insumos', autenticacionMiddleware, AlmacenCtrl.editarInsumosAlmacen);

export default rutasAlmacen;