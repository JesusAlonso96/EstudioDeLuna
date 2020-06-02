import { Router } from 'express';
import * as PedidosCtrl from '../controladores/pedidos';
import { autenticacionMiddleware, recepcionistaMiddleware } from '../middlewares/middlewares';

const rutasPedidos = Router();

/* GET */
rutasPedidos.get('/productos/:id', PedidosCtrl.obtenerProductosPorPedido);
rutasPedidos.get('/proceso/:id', autenticacionMiddleware, PedidosCtrl.obtenerPedidosEnProceso);
rutasPedidos.get('/pedidos/:id',autenticacionMiddleware, PedidosCtrl.obtenerPedidosPorEmpleado);
rutasPedidos.get('/numero-pedidos-cola', autenticacionMiddleware, PedidosCtrl.obtenerNumPedidosEnCola)
rutasPedidos.get('/empleados', autenticacionMiddleware, PedidosCtrl.obtenerNumPedidosPorEmpleado)
rutasPedidos.get('/numero-pedidos-proceso', autenticacionMiddleware, PedidosCtrl.obtenerNumPedidosEnProceso)
rutasPedidos.get('/cola', autenticacionMiddleware, PedidosCtrl.obtenerPedidosEnCola);
rutasPedidos.get('/numero-pedidos', autenticacionMiddleware, PedidosCtrl.numPedidosFotografo); 
rutasPedidos.get('/:tipoFiltro', autenticacionMiddleware, recepcionistaMiddleware, PedidosCtrl.obtenerPedidos);

/* POST */
rutasPedidos.post('/:id', autenticacionMiddleware, recepcionistaMiddleware, PedidosCtrl.crearPedido);

/* PATCH */
rutasPedidos.patch('/anticipo/:id/:anticipo', PedidosCtrl.actualizarAnticipoPedido);
rutasPedidos.patch('/tomar/:idPedido/:id', autenticacionMiddleware, PedidosCtrl.tomarPedido);
rutasPedidos.patch('/estado', PedidosCtrl.actualizarEstadoPedido);

/* DELETE */
rutasPedidos.delete('/notificaciones/:num', PedidosCtrl.eliminarNotificacionPorPedido);

export default rutasPedidos;
