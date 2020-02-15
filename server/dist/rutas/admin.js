"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminCtrl = __importStar(require("../controladores/admin"));
const UsuarioCtrl = __importStar(require("../controladores/usuario"));
const rutasAdmin = express_1.Router();
//get
rutasAdmin.get('/obtenerVentasDia', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasDia);
rutasAdmin.get('/obtenerVentasRango/:fechaInicio/:fechaFin', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasRango);
rutasAdmin.get('/obtenerMasVendidos/:fechaInicio/:fechaFin', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtener10ProductosMasVendidos);
rutasAdmin.get('/obtenerVentasPorFamilia/:fechaInicio/:fechaFin', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasPorFamilias);
rutasAdmin.get('/obtenerVentasMes/:fechaInicio/:fechaFin', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasMes);
rutasAdmin.get('/existeCorte', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.existeCorte);
rutasAdmin.get('/obtenerTotalCaja', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerCaja);
rutasAdmin.get('/obtenerCortesCaja', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerCortesCaja);
rutasAdmin.get('/obtenerUsuariosEliminados', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerUsuariosEliminados);
rutasAdmin.get('/obtenerProveedoresEliminados', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerProveedoresEliminados);
rutasAdmin.get('/obtenerProductosProveedorEliminados', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerProductosProveedorEliminados);
rutasAdmin.get('/obtenerEmpresasEliminadas', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerEmpresasEliminadas);
//post
rutasAdmin.post('/empleado', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.altaUsuario);
rutasAdmin.post('/crearCorteCaja', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.crearCorteCaja);
rutasAdmin.post('/registrar', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.registrarUsuario);
//patch
rutasAdmin.patch('/actualizarCaja', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.actualizarCaja);
rutasAdmin.patch('/cambiarPermisos', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.cambiarPermisos);
rutasAdmin.patch('/restaurarUsuario', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarUsuarioEliminado);
rutasAdmin.patch('/eliminarUsuario', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.eliminarUsuario);
rutasAdmin.patch('/editarUsuario', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.editarUsuario);
rutasAdmin.patch('/editarProveedor', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.editarProveedor);
rutasAdmin.patch('/eliminarProveedor', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.eliminarProveedor);
rutasAdmin.patch('/restaurarProveedorEliminado', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarProveedor);
rutasAdmin.patch('/eliminarProductoProveedor', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.eliminarProductoProveedor);
rutasAdmin.patch('/editarProductoProveedor', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.editarProductoProveedor);
rutasAdmin.patch('/restaurarProductoProveedorEliminado', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarProductoProveedorEliminado);
rutasAdmin.patch('/restaurarEmpresaEliminada', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarEmpresaEliminada);
exports.default = rutasAdmin;
