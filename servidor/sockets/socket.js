const ListaUsuarios = require('../clases/listaUsuarios');
const Usuario = require('../clases/usuario');
const io = require('socket.io');
const momento = require('moment');
/* Modelos mongoose */
const Notificacion = require('../modelos/notificacion');
const Pedido = require('../modelos/pedido');

var usuariosConectados = exports.usuariosConectados = new ListaUsuarios.default();

exports.conectarCliente = function (cliente) {
    const usuario = new Usuario.default(cliente.id);
    usuariosConectados.agregarUsuario(usuario);
}
exports.desconectar = function (cliente) {
    cliente.on('disconnect', () => {
        console.log('cliente desconectado');
        usuariosConectados.eliminarUsuario(cliente.id);
    })
}
exports.configurarUsuario = function (cliente, io) {
    cliente.on('configurar-usuario', (usuario, callback) => {
        usuariosConectados.actualizarDatos(cliente.id, usuario._id, usuario.nombre, usuario.rol, usuario.rol_sec);
        callback({ ok: true, mensaje: 'Usuario configurado' });
    })
}
exports.cerrarSesion = function (cliente) {
    cliente.on('cerrar-sesion', (payload, callback) => {
        usuariosConectados.actualizarDisponibilidad(cliente.id, payload._id)
        callback({ ok: true, mensaje: 'Usuario no disponible' });
    })
}
/* Listeners para pedidos */
exports.obtenerNotificaciones = function (cliente, io) {
    cliente.on('notificaciones', (pedido, callback) => {
        obtenerNumPedidosCola(io, callback)
        if (pedido.fotografo == null) { /*Si no hay fotografo se manda notificacion a todos los fotografos conectados */
            mandarNotificaciones(io, pedido, callback);
        } else { /*Si hay fotografo en el pedido la notificacion es solo para el */
            mandarNotificacion(io, pedido, callback);
        }
    })
}

//funciones auxiliares
function usuarioFotografoYConectado(usuario) {
    return usuario.rol == 0 && usuario.rol_sec == 1 && usuariosConectados.obtenerUsuario(usuario._id) !== undefined ? true : false;
}
/*Mandar notificaciones para pedidos en cola, sin asignar fotografo */
function mandarNotificaciones(io, pedido, callback) {
    var hoy = new Date();
    hoy = momento().format('YYYY-MM-DD');
    const notificacion = new Notificacion({
        titulo: 'Nuevo pedido en cola',
        mensaje: 'Existe un nuevo pedido en cola, verifica la seccion de Pedidos en cola',
        fecha: hoy,
        num_pedido: pedido.num_pedido,
        tipo_pedido: 0,
        usuario: pedido.fotografo
    })
    notificacion.save(function (err, guardada) {
        if (err) callback({ status: 'error', titulo: 'Error al guardar', detalles: 'Ocurrio un error al guardar la notificacion' });
        if (guardada) {
            for (let usuario of usuariosConectados.lista) {
                if (usuarioFotografoYConectado(usuario)) {
                    io.in(usuario.id).emit('obtener-notificaciones', notificacion);
                    io.in(usuario.id).emit('obtener-nuevo-pedido-cola', pedido);
                }
            }
        }
    })
}
/*Mandar notificacion para pedido ya asignado a fotografo */
function mandarNotificacion(io, pedido, callback) {
    var hoy = new Date();
    hoy = momento().format('YYYY-MM-DD');
    const notificacion = new Notificacion({
        titulo: 'Nuevo pedido rapido',
        mensaje: 'Existe un nuevo pedido rapido, verifica la seccion de pedidos realizados',
        fecha: hoy,
        num_pedido: pedido.num_pedido,
        tipo_pedido: 0,
        usuario: pedido.fotografo
    });
    notificacion.save(function (err, guardada) {
        if (err) callback({ status: 'error', titulo: 'Error al guardar', detalles: 'Ocurrio un error al guardar la notificacion' });
        if (guardada) {
            const usuario = usuariosConectados.obtenerUsuario(pedido.fotografo);
            if (usuario !== undefined) {
                io.in(usuario.id).emit('obtener-notificaciones', notificacion);
            }
            callback({ status: 'ok', titulo: 'Notificacion guardada', detalles: 'Notificacion enviada y guardada correctamente' });
        }
    });
}
function obtenerNumPedidosCola(io, callback) {
    Pedido.find({ fotografo: null })
        .countDocuments()
        .exec(function (err, pedidosEncontrados) {
            if (err) {
                callback({ status: 'error', titulo: 'Error', detalles: 'Ocurrio un error al obtener el numero de pedidos en cola' });
            }
            if (pedidosEncontrados) {
                io.emit('obtener-num-pedidos-cola', pedidosEncontrados);
            }
        })
}