import { Router } from 'express';
import { autenticacionMiddleware, adminOSupervisorMiddleware, adminOSupervisorORecepcionistaMiddleware } from '../middlewares/middlewares';
import * as CajaCtrl from '../controladores/caja';

const rutasCaja = Router();

//get
rutasCaja.get('/existe-corte/:id', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.existeCorteCaja);
rutasCaja.get('/cortes-caja/:id', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.obtenerCortesCaja);
rutasCaja.get('/eliminadas', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.obtenerCajasEliminadas);
rutasCaja.get('/desocupadas', autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware, CajaCtrl.obtenerCajasDesocupadas);
rutasCaja.get('/:id', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.obtenerCaja);
rutasCaja.get('', autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware, CajaCtrl.obtenerCajas);
//post
rutasCaja.post('/corte-caja', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.crearCorteCaja);
rutasCaja.post('', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.agregarCaja);
//patch
rutasCaja.patch('/abrir/:id', autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware, CajaCtrl.abrirCaja);
rutasCaja.patch('/restaurar', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.restaurarCaja);
rutasCaja.patch('/completa', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.actualizarCajaCompleta);
rutasCaja.patch('/:id', autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware, CajaCtrl.actualizarCaja);
rutasCaja.patch('', autenticacionMiddleware, adminOSupervisorMiddleware, CajaCtrl.eliminarCaja);

export default rutasCaja;
