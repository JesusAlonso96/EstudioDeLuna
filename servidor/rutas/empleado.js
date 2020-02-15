const express = require('express'),
    ruta = express.Router(),
    UsuarioCtrl = require('../controladores/usuario'),
    multer = require('multer'),
    Empleado = require('../controladores/empleado'),
    cron = require('node-cron'),
    app = require('../index');
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname + '.jpeg')
    },
    destination: function (req, file, cb) {
        cb(null, './subidas');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
}),
    upload = multer({ storage: storage });

//get
ruta.get('/fotografo/:id', UsuarioCtrl.autenticacionMiddleware, Empleado.obtenerFotografo)
ruta.get('/fotografos', UsuarioCtrl.autenticacionMiddleware, Empleado.obtenerFotografos)
ruta.get('/asignarFotografo/:fecha', UsuarioCtrl.autenticacionMiddleware, Empleado.asignarFotografo);
ruta.get('/asistioTrabajador/:id/:fecha', Empleado.tieneAsistenciaTrabajador);
ruta.get('/obtenerNotificaciones/:id/:fecha', Empleado.obtenerNotificaciones);
ruta.get('/numPedidos', /*UsuarioCtrl.autenticacionMiddleware,*/ Empleado.numPedidosFotografo);
ruta.get('/obtenerPedidos', UsuarioCtrl.autenticacionMiddleware, Empleado.recepcionistaMiddleware, Empleado.obtenerPedidos);
ruta.get('/obtenerPedidosPorEmpleado/:id', Empleado.obtenerPedidosPorEmpleado);
ruta.get('/obtenerNumPedidosPorEmpleado', UsuarioCtrl.autenticacionMiddleware, Empleado.obtenerNumPedidosPorEmpleado)
ruta.get('/obtenerPedidosEnProceso/:id', UsuarioCtrl.autenticacionMiddleware, Empleado.obtenerPedidosEnProceso);
ruta.get('/obtenerNumPedidosEnProceso', UsuarioCtrl.autenticacionMiddleware, Empleado.obtenerNumPedidosEnProceso)
ruta.get('/obtenerPedidosEnCola', UsuarioCtrl.autenticacionMiddleware, Empleado.obtenerPedidosEnCola);
ruta.get('/obtenerNumPedidosEnCola', UsuarioCtrl.autenticacionMiddleware, Empleado.obtenerNumPedidosEnCola)
ruta.get('/obtenerProductosPorPedido/:id', Empleado.obtenerProductosPorPedido);
//post
ruta.post('/crearPedido/:id', UsuarioCtrl.autenticacionMiddleware, Empleado.recepcionistaMiddleware, Empleado.crearPedido);
ruta.post('/crearVenta/:cantidadACaja/:metodoPago', UsuarioCtrl.autenticacionMiddleware, Empleado.recepcionistaMiddleware, Empleado.realizarVenta);
//patch
ruta.patch('/crearImagen/:id', upload.single('image'), Empleado.crearFoto);
ruta.patch('/tomarPedido/:idPedido/:id', UsuarioCtrl.autenticacionMiddleware, Empleado.tomarPedido);
ruta.patch('/actualizarEstado', Empleado.actualizarEstadoPedido);
ruta.patch('/actualizarAnticipo/:id/:anticipo', Empleado.actualizarAnticipoPedido);
ruta.patch('/actualizarOcupado/:id', Empleado.actualizarOcupado);
ruta.patch('/actualizarCaja/:cantidadACaja/:metodoPago', Empleado.actualizarCaja);
//delete
ruta.delete('/eliminarNotificacion/:id', Empleado.eliminarNotificacion);
ruta.delete('/eliminarNotificacionPorPedido/:num', Empleado.eliminarNotificacionPorPedido);

//tareas programadas
cron.schedule('0 23 * * *', Empleado.eliminarNotificaciones);
module.exports = ruta;