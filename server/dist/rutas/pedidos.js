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
const PedidosCtrl = __importStar(require("../controladores/pedidos"));
const middlewares_1 = require("../middlewares/middlewares");
const rutasPedidos = express_1.Router();
/* GET */
rutasPedidos.get('/productos/:id', PedidosCtrl.obtenerProductosPorPedido);
rutasPedidos.get('/proceso/:id', middlewares_1.autenticacionMiddleware, PedidosCtrl.obtenerPedidosEnProceso);
rutasPedidos.get('/pedidos/:id', middlewares_1.autenticacionMiddleware, PedidosCtrl.obtenerPedidosPorEmpleado);
rutasPedidos.get('/numero-pedidos-cola', middlewares_1.autenticacionMiddleware, PedidosCtrl.obtenerNumPedidosEnCola);
rutasPedidos.get('/empleados', middlewares_1.autenticacionMiddleware, PedidosCtrl.obtenerNumPedidosPorEmpleado);
rutasPedidos.get('/numero-pedidos-proceso', middlewares_1.autenticacionMiddleware, PedidosCtrl.obtenerNumPedidosEnProceso);
rutasPedidos.get('/cola', middlewares_1.autenticacionMiddleware, PedidosCtrl.obtenerPedidosEnCola);
rutasPedidos.get('/numero-pedidos', middlewares_1.autenticacionMiddleware, PedidosCtrl.numPedidosFotografo);
rutasPedidos.get('/:tipoFiltro', middlewares_1.autenticacionMiddleware, middlewares_1.recepcionistaMiddleware, PedidosCtrl.obtenerPedidos);
/* POST */
rutasPedidos.post('/:id', middlewares_1.autenticacionMiddleware, middlewares_1.recepcionistaMiddleware, PedidosCtrl.crearPedido);
/* PATCH */
rutasPedidos.patch('/anticipo/:id/:anticipo', PedidosCtrl.actualizarAnticipoPedido);
rutasPedidos.patch('/tomar/:idPedido/:id', middlewares_1.autenticacionMiddleware, PedidosCtrl.tomarPedido);
rutasPedidos.patch('/estado', PedidosCtrl.actualizarEstadoPedido);
/* DELETE */
rutasPedidos.delete('/notificaciones/:num', PedidosCtrl.eliminarNotificacionPorPedido);
exports.default = rutasPedidos;
