"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const EmpleadoCtrl = __importStar(require("../controladores/empleado"));
const middlewares_1 = require("../middlewares/middlewares");
const storage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname + '.jpeg');
    },
    destination: function (req, file, cb) {
        cb(null, './subidas');
    }
}), upload = multer_1.default({ storage: storage });
const rutasEmpleado = express_1.Router();
//get
rutasEmpleado.get('/fotografo/:id', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.obtenerFotografo);
rutasEmpleado.get('/fotografos', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.obtenerFotografos);
rutasEmpleado.get('/asignarFotografo/:fecha', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.asignarFotografo);
rutasEmpleado.get('/asistioTrabajador/:id/:fecha', EmpleadoCtrl.tieneAsistenciaTrabajador);
rutasEmpleado.get('/obtenerNotificaciones/:id/:fecha', EmpleadoCtrl.obtenerNotificaciones);
rutasEmpleado.get('/numPedidos', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.numPedidosFotografo);
rutasEmpleado.get('/obtenerPedidos', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.recepcionistaMiddleware, EmpleadoCtrl.obtenerPedidos);
rutasEmpleado.get('/obtenerPedidosPorEmpleado/:id', EmpleadoCtrl.obtenerPedidosPorEmpleado);
rutasEmpleado.get('/obtenerNumPedidosPorEmpleado', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosPorEmpleado);
rutasEmpleado.get('/obtenerPedidosEnProceso/:id', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.obtenerPedidosEnProceso);
rutasEmpleado.get('/obtenerNumPedidosEnProceso', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosEnProceso);
rutasEmpleado.get('/obtenerPedidosEnCola', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.obtenerPedidosEnCola);
rutasEmpleado.get('/obtenerNumPedidosEnCola', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosEnCola);
rutasEmpleado.get('/obtenerProductosPorPedido/:id', EmpleadoCtrl.obtenerProductosPorPedido);
//post
rutasEmpleado.post('/crearPedido/:id', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.recepcionistaMiddleware, EmpleadoCtrl.crearPedido);
rutasEmpleado.post('/crearVenta/:cantidadACaja/:metodoPago/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorORecepcionistaMiddleware, EmpleadoCtrl.realizarVenta);
//patch
rutasEmpleado.patch('/crearImagen/:id', upload.single('imagen'), EmpleadoCtrl.crearFoto);
rutasEmpleado.patch('/tomarPedido/:idPedido/:id', middlewares_1.autenticacionMiddleware, EmpleadoCtrl.tomarPedido);
rutasEmpleado.patch('/actualizarEstado', EmpleadoCtrl.actualizarEstadoPedido);
rutasEmpleado.patch('/actualizarAnticipo/:id/:anticipo', EmpleadoCtrl.actualizarAnticipoPedido);
rutasEmpleado.patch('/actualizarOcupado/:id', EmpleadoCtrl.actualizarOcupado);
rutasEmpleado.patch('/actualizarCaja/:cantidadACaja/:metodoPago/:id', EmpleadoCtrl.actualizarCaja);
//delete
rutasEmpleado.delete('/eliminarNotificacion/:id', EmpleadoCtrl.eliminarNotificacion);
rutasEmpleado.delete('/eliminarNotificacionPorPedido/:num', EmpleadoCtrl.eliminarNotificacionPorPedido);
exports.default = rutasEmpleado;
