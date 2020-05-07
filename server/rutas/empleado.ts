import { Router } from 'express';
import multer from 'multer';
import * as EmpleadoCtrl from '../controladores/empleado';
import { autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware } from '../middlewares/middlewares';
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname + '.jpeg')
    },
    destination: function (req, file, cb) {
        cb(null, './subidas');
    }
}),
    upload = multer({ storage: storage }); 
const rutasEmpleado = Router();

//get
rutasEmpleado.get('/fotografo/:id', autenticacionMiddleware, EmpleadoCtrl.obtenerFotografo)
rutasEmpleado.get('/fotografos', autenticacionMiddleware, EmpleadoCtrl.obtenerFotografos)
rutasEmpleado.get('/asignarFotografo/:fecha', autenticacionMiddleware, EmpleadoCtrl.asignarFotografo);
rutasEmpleado.get('/asistioTrabajador/:id/:fecha', EmpleadoCtrl.tieneAsistenciaTrabajador);
rutasEmpleado.get('/obtenerNotificaciones/:id/:fecha', EmpleadoCtrl.obtenerNotificaciones);
rutasEmpleado.get('/numPedidos', autenticacionMiddleware, EmpleadoCtrl.numPedidosFotografo);
rutasEmpleado.get('/obtenerPedidos', autenticacionMiddleware, EmpleadoCtrl.recepcionistaMiddleware, EmpleadoCtrl.obtenerPedidos);
rutasEmpleado.get('/obtenerPedidosPorEmpleado/:id', EmpleadoCtrl.obtenerPedidosPorEmpleado);
rutasEmpleado.get('/obtenerNumPedidosPorEmpleado', autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosPorEmpleado)
rutasEmpleado.get('/obtenerPedidosEnProceso/:id', autenticacionMiddleware, EmpleadoCtrl.obtenerPedidosEnProceso);
rutasEmpleado.get('/obtenerNumPedidosEnProceso', autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosEnProceso)
rutasEmpleado.get('/obtenerPedidosEnCola', autenticacionMiddleware, EmpleadoCtrl.obtenerPedidosEnCola);
rutasEmpleado.get('/obtenerNumPedidosEnCola', autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosEnCola)
rutasEmpleado.get('/obtenerProductosPorPedido/:id', EmpleadoCtrl.obtenerProductosPorPedido);

//post
rutasEmpleado.post('/crearPedido/:id', autenticacionMiddleware, EmpleadoCtrl.recepcionistaMiddleware, EmpleadoCtrl.crearPedido);
rutasEmpleado.post('/crearVenta/:cantidadACaja/:metodoPago/:id', autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware, EmpleadoCtrl.realizarVenta);

//patch
rutasEmpleado.patch('/crearImagen/:id', upload.single('imagen'), EmpleadoCtrl.crearFoto);
rutasEmpleado.patch('/tomarPedido/:idPedido/:id', autenticacionMiddleware, EmpleadoCtrl.tomarPedido);
rutasEmpleado.patch('/actualizarEstado', EmpleadoCtrl.actualizarEstadoPedido);
rutasEmpleado.patch('/actualizarAnticipo/:id/:anticipo', EmpleadoCtrl.actualizarAnticipoPedido);
rutasEmpleado.patch('/actualizarOcupado/:id', EmpleadoCtrl.actualizarOcupado);
rutasEmpleado.patch('/actualizarCaja/:cantidadACaja/:metodoPago/:id', EmpleadoCtrl.actualizarCaja);

//delete
rutasEmpleado.delete('/eliminarNotificacion/:id', EmpleadoCtrl.eliminarNotificacion);
rutasEmpleado.delete('/eliminarNotificacionPorPedido/:num', EmpleadoCtrl.eliminarNotificacionPorPedido);


export default rutasEmpleado;