import { Router } from 'express';
import * as GastoGeneralCtrl from '../controladores/gasto_general';
import { autenticacionMiddleware } from '../middlewares/middlewares';

const rutasGastoGeneral = Router();
/* GET */
rutasGastoGeneral.get('/eliminados', autenticacionMiddleware, GastoGeneralCtrl.obtenerGastosGeneralesEliminados);
rutasGastoGeneral.get('/:id', autenticacionMiddleware, GastoGeneralCtrl.obtenerGastoGeneralPorId);
rutasGastoGeneral.get('', autenticacionMiddleware, GastoGeneralCtrl.obtenerGastosGenerales);
/* POST */
rutasGastoGeneral.post('', autenticacionMiddleware, GastoGeneralCtrl.nuevoGastoGeneral);
/* PUT */
rutasGastoGeneral.put('/:id', autenticacionMiddleware, GastoGeneralCtrl.editarGastoGeneral);
/* PATCH */
rutasGastoGeneral.patch('/:id/eliminar', autenticacionMiddleware, GastoGeneralCtrl.eliminarGastoGeneral);
rutasGastoGeneral.patch('/:id/restauracion', autenticacionMiddleware, GastoGeneralCtrl.restaurarGastoGeneral);

export default rutasGastoGeneral;