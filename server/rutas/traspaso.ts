import {Router} from 'express';
import * as TraspasoCtrl from '../controladores/traspaso';
import * as UsuarioCtrl from '../controladores/usuario';

const rutasTraspaso = Router();
/* GET */
rutasTraspaso.get('/pendientes', UsuarioCtrl.autenticacionMiddleware, TraspasoCtrl.obtenerTraspasosPendientes);

/* POST */
rutasTraspaso.post('', UsuarioCtrl.autenticacionMiddleware, TraspasoCtrl.nuevoTraspaso);

/* PUT */

/* PATCH */
rutasTraspaso.patch('/:id/estado', UsuarioCtrl.autenticacionMiddleware, TraspasoCtrl.editarEstadoTraspaso);
rutasTraspaso.patch('/:id', UsuarioCtrl.autenticacionMiddleware, TraspasoCtrl.eliminarTraspaso);


export default rutasTraspaso;