import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import * as CajaCtrl from '../controladores/caja';
import * as AdminCtrl from '../controladores/admin';
const rutasCaja = Router();

//get
rutasCaja.get('/existe-corte/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.existeCorteCaja);
rutasCaja.get('/cortes-caja/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.obtenerCortesCaja);
rutasCaja.get('/eliminadas', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.obtenerCajasEliminadas);
rutasCaja.get('/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.obtenerCaja);
rutasCaja.get('', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.obtenerCajas);
//post
rutasCaja.post('/corte-caja', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.crearCorteCaja);
rutasCaja.post('', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.agregarCaja);
//patch
rutasCaja.patch('/restaurar', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.restaurarCaja);
rutasCaja.patch('/:id', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, CajaCtrl.actualizarCaja);
rutasCaja.patch('', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.eliminarCaja);

export default rutasCaja;
