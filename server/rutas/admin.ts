import { Router } from 'express';
import * as AdminCtrl from '../controladores/admin';
import {autenticacionMiddleware, adminORootMiddleware} from '../middlewares/middlewares';

const rutasAdmin = Router();

//get
rutasAdmin.get('/obtenerVentasDia',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasDia);
rutasAdmin.get('/obtenerVentasRango/:fechaInicio/:fechaFin',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasRango);
rutasAdmin.get('/obtenerMasVendidos/:fechaInicio/:fechaFin',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtener10ProductosMasVendidos);
rutasAdmin.get('/obtenerVentasPorFamilia/:fechaInicio/:fechaFin',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasPorFamilias);
rutasAdmin.get('/obtenerVentasMes/:fechaInicio/:fechaFin',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasMes);
rutasAdmin.get('/obtenerTotalCaja/:id',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerCaja);
rutasAdmin.get('/obtenerUsuariosEliminados',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerUsuariosEliminados);
rutasAdmin.get('/obtenerEmpresasEliminadas',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerEmpresasEliminadas);
rutasAdmin.get('/obtenerFamiliasEliminadas',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerFamiliasEliminadas);
//post
rutasAdmin.post('/empleado',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.altaUsuario);
rutasAdmin.post('/registrar',autenticacionMiddleware, adminORootMiddleware, AdminCtrl.registrarUsuario);
//patch
rutasAdmin.patch('/cambiarPermisos',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.cambiarPermisos);
rutasAdmin.patch('/restaurarUsuario',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarUsuarioEliminado);
rutasAdmin.patch('/eliminarUsuario',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.eliminarUsuario);
rutasAdmin.patch('/editarUsuario',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.editarUsuario);
rutasAdmin.patch('/restaurarEmpresaEliminada',autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarEmpresaEliminada);
rutasAdmin.patch('/restaurarFamiliaEliminada',autenticacionMiddleware, AdminCtrl.adminMiddleware,AdminCtrl.restaurarFamiliaEliminada);


export default rutasAdmin;