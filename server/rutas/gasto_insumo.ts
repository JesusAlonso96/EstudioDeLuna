import { Router } from 'express';
import * as GastoInsumoCtrl from '../controladores/gasto_insumo';
import { autenticacionMiddleware } from '../middlewares/middlewares';

const rutasGastoInsumo = Router();
/* GET */
rutasGastoInsumo.get('/reporte-por-fecha', autenticacionMiddleware, GastoInsumoCtrl.obteneReporteGastosInsumosPorFecha);
rutasGastoInsumo.get('/reporte-por-proveedor', autenticacionMiddleware, GastoInsumoCtrl.obteneReporteGastosInsumosPorProveedor);
rutasGastoInsumo.get('/eliminados', autenticacionMiddleware, GastoInsumoCtrl.obtenerGastosInsumosEliminados);
rutasGastoInsumo.get('/:id', autenticacionMiddleware, GastoInsumoCtrl.obtenerGastoInsumoPorId);
rutasGastoInsumo.get('', autenticacionMiddleware, GastoInsumoCtrl.obtenerGastosInsumos);
/* POST */
rutasGastoInsumo.post('', autenticacionMiddleware, GastoInsumoCtrl.nuevoGastoInsumo);
/* PUT */
rutasGastoInsumo.put('/:id', autenticacionMiddleware, GastoInsumoCtrl.editarGastoInsumo);
/* PATCH */
rutasGastoInsumo.patch('/:id/eliminar', autenticacionMiddleware, GastoInsumoCtrl.eliminarGastoInsumo);
rutasGastoInsumo.patch('/:id/restauracion', autenticacionMiddleware, GastoInsumoCtrl.restaurarGastoInsumo);

export default rutasGastoInsumo;