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
const middlewares_1 = require("../middlewares/middlewares");
const rutasAdmin = express_1.Router();
//get
rutasAdmin.get('/obtenerVentasDia', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasDia);
rutasAdmin.get('/obtenerVentasRango/:fechaInicio/:fechaFin', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasRango);
rutasAdmin.get('/obtenerMasVendidos/:fechaInicio/:fechaFin', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtener10ProductosMasVendidos);
rutasAdmin.get('/obtenerVentasPorFamilia/:fechaInicio/:fechaFin', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasPorFamilias);
rutasAdmin.get('/obtenerVentasMes/:fechaInicio/:fechaFin', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasMes);
rutasAdmin.get('/obtenerTotalCaja/:id', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerCaja);
rutasAdmin.get('/obtenerUsuariosEliminados', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerUsuariosEliminados);
rutasAdmin.get('/obtenerEmpresasEliminadas', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerEmpresasEliminadas);
rutasAdmin.get('/obtenerFamiliasEliminadas', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerFamiliasEliminadas);
//post
rutasAdmin.post('/empleado', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.altaUsuario);
rutasAdmin.post('/registrar', middlewares_1.autenticacionMiddleware, middlewares_1.adminORootMiddleware, AdminCtrl.registrarUsuario);
//patch
rutasAdmin.patch('/cambiarPermisos', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.cambiarPermisos);
rutasAdmin.patch('/restaurarUsuario', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarUsuarioEliminado);
rutasAdmin.patch('/eliminarUsuario', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.eliminarUsuario);
rutasAdmin.patch('/editarUsuario', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.editarUsuario);
rutasAdmin.patch('/restaurarEmpresaEliminada', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarEmpresaEliminada);
rutasAdmin.patch('/restaurarFamiliaEliminada', middlewares_1.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarFamiliaEliminada);
exports.default = rutasAdmin;
