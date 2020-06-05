import { Router } from 'express';
import * as TipoGastoGeneralCtrl from '../controladores/tipo_gasto_general';
import { autenticacionMiddleware } from '../middlewares/middlewares';

const rutasTipoGastoGeneral = Router();
/* GET */
rutasTipoGastoGeneral.get('/eliminados', autenticacionMiddleware, TipoGastoGeneralCtrl.obtenerTiposGastoGeneralEliminados);
rutasTipoGastoGeneral.get('/:id', autenticacionMiddleware, TipoGastoGeneralCtrl.obtenerTipoGastoGeneralPorId);
rutasTipoGastoGeneral.get('', autenticacionMiddleware, TipoGastoGeneralCtrl.obtenerTiposGastoGeneral);
/* POST */
rutasTipoGastoGeneral.post('', autenticacionMiddleware, TipoGastoGeneralCtrl.nuevoTipoGastoGeneral);
/* PUT */
rutasTipoGastoGeneral.put('/:id', autenticacionMiddleware, TipoGastoGeneralCtrl.editarTipoGastoGeneral);
/* PATCH */
rutasTipoGastoGeneral.patch('/:id/eliminar', autenticacionMiddleware, TipoGastoGeneralCtrl.eliminarTipoGastoGeneral);
rutasTipoGastoGeneral.patch('/:id/restauracion', autenticacionMiddleware, TipoGastoGeneralCtrl.restaurarTipoGastoGeneral);

export default rutasTipoGastoGeneral;