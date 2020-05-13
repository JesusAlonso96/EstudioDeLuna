import { Router } from 'express';
import { autenticacionMiddleware, adminOSupervisorMiddleware } from '../middlewares/middlewares';
import * as CotizacionesCtrl from '../controladores/cotizaciones';
const rutasCotizaciones = Router();

/* GET */
rutasCotizaciones.get('/empresas', autenticacionMiddleware, adminOSupervisorMiddleware, CotizacionesCtrl.obtenerEmpresas);
rutasCotizaciones.get('', autenticacionMiddleware, adminOSupervisorMiddleware, CotizacionesCtrl.obtenerCotizaciones);

/* POST */
rutasCotizaciones.post('/empresas', autenticacionMiddleware, adminOSupervisorMiddleware, CotizacionesCtrl.nuevaEmpresa);
rutasCotizaciones.post('', autenticacionMiddleware, adminOSupervisorMiddleware, CotizacionesCtrl.nuevaCotizacion);

/* PUT */
rutasCotizaciones.put('/empresa', autenticacionMiddleware, adminOSupervisorMiddleware, CotizacionesCtrl.editarEmpresa);

/* PATCH */
rutasCotizaciones.patch('/empresa', autenticacionMiddleware, adminOSupervisorMiddleware, CotizacionesCtrl.eliminarEmpresa);


export default rutasCotizaciones;