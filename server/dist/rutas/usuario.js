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
const UsuarioCtrl = __importStar(require("../controladores/usuario"));
const rutasUsuario = express_1.Router();
//get
rutasUsuario.get('/obtenerPestanas/:rol', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerPestanas);
rutasUsuario.get('/obtenerPedidosRealizadosPorFotografo/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerPedidosRealizadosPorFotografo);
rutasUsuario.get('/obtenerPedidosRealizados', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosRealizados);
rutasUsuario.get('/obtenerUsuarios', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerUsuarios);
rutasUsuario.get('/obtenerUsuario/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerUsuario);
rutasUsuario.get('/obtenerFotografos', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerFotografos);
rutasUsuario.get('/obtenerPedidosVendidos/:filtro', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosVendidos);
rutasUsuario.get('/obtenerPedidosVendidosPorFotografo/:id/:filtro', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosVendidosPorFotografo);
rutasUsuario.get('/obtenerVentasConRetoquePorFotografo', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerVentasConRetoquePorFotografo);
rutasUsuario.get('/desglosarVentasConRetoquePorFotografo/:id', UsuarioCtrl.desglosarVentasConRetoquePorFotografo);
rutasUsuario.get('/obtenerProveedores', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerProveedores);
rutasUsuario.get('/obtenerListaProveedores', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerListaProveedores);
rutasUsuario.get('/obtenerProductosProveedor/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerProductosProveedor);
rutasUsuario.get('/obtenerEmpresas', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerEmpresas);
rutasUsuario.get('/obtenerDatosEstudio', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerDatosEstudio);
rutasUsuario.get('/obtenerCotizaciones', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerCotizaciones);
//post
rutasUsuario.post('/login', UsuarioCtrl.login);
rutasUsuario.post('/crearAsistencia/:id', UsuarioCtrl.crearAsistencia);
rutasUsuario.post('/agregarProducto', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.agregarProducto);
rutasUsuario.post('/agregarFamilia', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.agregarFamilia);
rutasUsuario.post('/nuevoProveedor', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.nuevoProveedor);
rutasUsuario.post('/agregarProductoProveedor', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.agregarProductoProveedor);
rutasUsuario.post('/agregarEmpresa', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.nuevaEmpresa);
rutasUsuario.post('/agregarCotizacion', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.nuevaCotizacion);
//patch
rutasUsuario.patch('/actualizarProducto', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.actualizarProducto);
rutasUsuario.patch('/eliminarProducto/:id/:idFamilia', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.eliminarProducto);
rutasUsuario.patch('/eliminarFamilia/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.eliminarFamilia);
rutasUsuario.patch('/eliminarEmpresa', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.eliminarEmpresa);
rutasUsuario.patch('/actualizarEmpresa', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.editarEmpresa);
exports.default = rutasUsuario;