import {Router} from 'express';
import * as TraspasoCtrl from '../controladores/traspaso';
import * as UsuarioCtrl from '../controladores/usuario';
import { autenticacionMiddleware } from '../middlewares/middlewares';

const rutasTraspaso = Router();
/* GET */
rutasTraspaso.get('/pendientes', autenticacionMiddleware, TraspasoCtrl.obtenerTraspasosPendientes);

/* POST */
rutasTraspaso.post('', autenticacionMiddleware, TraspasoCtrl.nuevoTraspaso);

/* PUT */

/* PATCH */
rutasTraspaso.patch('/:id/estado', autenticacionMiddleware, TraspasoCtrl.editarEstadoTraspaso);
rutasTraspaso.patch('/:id', autenticacionMiddleware, TraspasoCtrl.eliminarTraspaso);


export default rutasTraspaso;