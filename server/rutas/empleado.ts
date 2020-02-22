import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import * as EmpleadoCtrl from '../controladores/empleado';
import multer from 'multer';
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
rutasEmpleado.get('/fotografo/:id', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.obtenerFotografo)
rutasEmpleado.get('/fotografos', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.obtenerFotografos)
rutasEmpleado.get('/asignarFotografo/:fecha', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.asignarFotografo);
rutasEmpleado.get('/asistioTrabajador/:id/:fecha', EmpleadoCtrl.tieneAsistenciaTrabajador);
rutasEmpleado.get('/obtenerNotificaciones/:id/:fecha', EmpleadoCtrl.obtenerNotificaciones);
rutasEmpleado.get('/numPedidos', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.numPedidosFotografo);
rutasEmpleado.get('/obtenerPedidos', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.recepcionistaMiddleware, EmpleadoCtrl.obtenerPedidos);
rutasEmpleado.get('/obtenerPedidosPorEmpleado/:id', EmpleadoCtrl.obtenerPedidosPorEmpleado);
rutasEmpleado.get('/obtenerNumPedidosPorEmpleado', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosPorEmpleado)
rutasEmpleado.get('/obtenerPedidosEnProceso/:id', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.obtenerPedidosEnProceso);
rutasEmpleado.get('/obtenerNumPedidosEnProceso', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosEnProceso)
rutasEmpleado.get('/obtenerPedidosEnCola', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.obtenerPedidosEnCola);
rutasEmpleado.get('/obtenerNumPedidosEnCola', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.obtenerNumPedidosEnCola)
rutasEmpleado.get('/obtenerProductosPorPedido/:id', EmpleadoCtrl.obtenerProductosPorPedido);

//post
rutasEmpleado.post('/crearPedido/:id', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.recepcionistaMiddleware, EmpleadoCtrl.crearPedido);
rutasEmpleado.post('/crearVenta/:cantidadACaja/:metodoPago', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.recepcionistaMiddleware, EmpleadoCtrl.realizarVenta);

//patch
rutasEmpleado.patch('/crearImagen/:id', upload.single('image'), EmpleadoCtrl.crearFoto);
rutasEmpleado.patch('/tomarPedido/:idPedido/:id', UsuarioCtrl.autenticacionMiddleware, EmpleadoCtrl.tomarPedido);
rutasEmpleado.patch('/actualizarEstado', EmpleadoCtrl.actualizarEstadoPedido);
rutasEmpleado.patch('/actualizarAnticipo/:id/:anticipo', EmpleadoCtrl.actualizarAnticipoPedido);
rutasEmpleado.patch('/actualizarOcupado/:id', EmpleadoCtrl.actualizarOcupado);
rutasEmpleado.patch('/actualizarCaja/:cantidadACaja/:metodoPago', EmpleadoCtrl.actualizarCaja);

//delete
rutasEmpleado.delete('/eliminarNotificacion/:id', EmpleadoCtrl.eliminarNotificacion);
rutasEmpleado.delete('/eliminarNotificacionPorPedido/:num', EmpleadoCtrl.eliminarNotificacionPorPedido);


export default rutasEmpleado;