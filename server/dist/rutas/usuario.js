"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioCtrl = __importStar(require("../controladores/usuario"));
const middlewares_1 = require("../middlewares/middlewares");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname + '.jpeg');
    },
    destination: function (req, file, cb) {
        cb(null, './subidas');
    }
}), upload = multer_1.default({ storage: storage });
const rutasUsuario = express_1.Router();
//get
rutasUsuario.get('/obtenerPestanas/:rol', middlewares_1.autenticacionMiddleware, UsuarioCtrl.obtenerPestanas);
rutasUsuario.get('/obtenerPedidosRealizadosPorFotografo/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.obtenerPedidosRealizadosPorFotografo);
rutasUsuario.get('/obtenerPedidosRealizados', middlewares_1.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosRealizados);
rutasUsuario.get('/obtenerUsuarios', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.obtenerUsuarios);
rutasUsuario.get('/obtenerUsuario/:id', middlewares_1.autenticacionMiddleware, UsuarioCtrl.obtenerUsuario);
rutasUsuario.get('/obtenerFotografos', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.obtenerFotografos);
rutasUsuario.get('/obtenerPedidosVendidos/:filtro', middlewares_1.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosVendidos);
rutasUsuario.get('/obtenerPedidosVendidosPorFotografo/:id/:filtro', middlewares_1.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosVendidosPorFotografo);
rutasUsuario.get('/obtenerVentasConRetoquePorFotografo', middlewares_1.autenticacionMiddleware, UsuarioCtrl.obtenerVentasConRetoquePorFotografo);
rutasUsuario.get('/desglosarVentasConRetoquePorFotografo/:id', UsuarioCtrl.desglosarVentasConRetoquePorFotografo);
rutasUsuario.get('/obtenerEmpresas', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.obtenerEmpresas);
rutasUsuario.get('/obtenerDatosEstudio', middlewares_1.autenticacionMiddleware, UsuarioCtrl.obtenerDatosEstudio);
rutasUsuario.get('/obtenerCotizaciones', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.obtenerCotizaciones);
rutasUsuario.get('/ordenesCompra', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.obtenerOrdenesCompra);
rutasUsuario.get('/sucursales', middlewares_1.autenticacionMiddleware, UsuarioCtrl.obtenerSucursales);
//post
rutasUsuario.post('/login', UsuarioCtrl.login);
rutasUsuario.post('/crearAsistencia/:id', UsuarioCtrl.crearAsistencia);
rutasUsuario.post('/agregarProducto', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.agregarProducto);
rutasUsuario.post('/agregarFamilia', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.agregarFamilia);
rutasUsuario.post('/agregarEmpresa', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.nuevaEmpresa);
rutasUsuario.post('/agregarCotizacion', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.nuevaCotizacion);
rutasUsuario.post('/ordenCompra', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.nuevaOrdenCompra);
rutasUsuario.post('/compra', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.registrarCompra);
//patch
rutasUsuario.patch('/eliminarProducto/:id/:idFamilia', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.eliminarProducto);
rutasUsuario.patch('/eliminarFamilia/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.eliminarFamilia);
rutasUsuario.patch('/recuperarContrasena/:email', UsuarioCtrl.recuperarContrasena);
rutasUsuario.patch('/ordenCompra/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.desactivarOrdenComra);
rutasUsuario.patch('/actualizarProducto', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.actualizarProducto);
rutasUsuario.patch('/eliminarEmpresa', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.eliminarEmpresa);
rutasUsuario.patch('/actualizarEmpresa', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, UsuarioCtrl.editarEmpresa);
rutasUsuario.patch('/generarCodigoRecuperacion', UsuarioCtrl.generarCodigoRecuperacion);
rutasUsuario.patch('/eliminarCodigoRecuperacion', UsuarioCtrl.eliminarCodigoRecuperacion);
exports.default = rutasUsuario;
