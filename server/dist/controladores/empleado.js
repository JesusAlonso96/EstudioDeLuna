"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_model_1 = require("../modelos/usuario.model");
const mongoose_1 = require("mongoose");
const cliente_model_1 = require("../modelos/cliente.model");
const pedido_model_1 = require("../modelos/pedido.model");
const moment_1 = __importDefault(require("moment"));
const venta_model_1 = require("../modelos/venta.model");
const caja_model_1 = require("../modelos/caja.model");
const notificacion_model_1 = require("../modelos/notificacion.model");
exports.asignarFotografo = (req, res) => {
    var fecha = new Date(req.params.fecha);
    usuario_model_1.Usuario.aggregate()
        .lookup({
        from: "asistencias",
        localField: "asistencia",
        foreignField: "_id",
        as: "asistencia"
    })
        .match({
        "asistencia.asistencia": true,
        "asistencia.fecha": fecha,
        rol: 0,
        rol_sec: 1,
        ocupado: false
    })
        .project({
        _id: 1,
        nombre: 1,
        ape_pat: 1,
        ape_mat: 1,
        ocupado: 1,
        pedidosTomados: 1
    })
        .exec((err, asistencia) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Error al asignar al fotografo' });
        if (asistencia.length > 0) {
            return res.json(asistencia);
        }
        else {
            return res.status(422).send({ titulo: 'No hay ningun fotografo desocupado' });
        }
    });
};
exports.numPedidosFotografo = (req, res) => {
    usuario_model_1.Usuario.aggregate()
        .unwind("pedidosTomados")
        .lookup({
        from: "pedidos",
        localField: "pedidosTomados",
        foreignField: "_id",
        as: "pedidosTomados"
    })
        .match({
        rol: 0,
        rol_sec: 1
    })
        .group({
        _id: "$pedidosTomados.fotografo",
        count: { $sum: 1 }
    })
        .project({
        _id: 1,
        count: 1
    })
        .sort({
        count: 'asc'
    })
        .exec((err, respuesta) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al asignar al fotografo' });
        if (respuesta.length > 0) {
            return res.json(respuesta[0]._id[0]);
        }
        else {
            return res.status(422).send({ titulo: 'Sin fotografo', detalles: 'No hay ningun fotografo disponible' });
        }
    });
};
exports.tieneAsistenciaTrabajador = (req, res) => {
    var fecha = new Date(req.params.fecha);
    usuario_model_1.Usuario.aggregate()
        .unwind("asistencia")
        .lookup({
        from: "asistencias",
        localField: "asistencia",
        foreignField: "_id",
        as: "asistencia"
    })
        .match({
        "asistencia.asistencia": true,
        "asistencia.fecha": fecha,
        rol: 0,
        _id: mongoose_1.Types.ObjectId(req.params.id)
    })
        .project({
        _id: 0,
        nombre: 1,
        asistencia: 1
    })
        .exec((err, asistencia) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al intentar verificar la asistencia' });
        if (asistencia.length > 0) {
            return res.json({ titulo: 'Asistio' });
        }
        else {
            return res.json({ titulo: 'No asistio' });
        }
    });
};
exports.crearPedido = (req, res) => {
    if (req.body.fotografo._id == undefined) {
        req.body.fotografo = null;
    }
    let pedidoAlta = new pedido_model_1.Pedido(req.body);
    pedidoAlta.save((err, pedidoGuardado) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear el pedido' });
        }
        if (pedidoAlta.fotografo) {
            usuario_model_1.Usuario.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    pedidosTomados: pedidoGuardado
                }
            }, (err, ok) => { if (err) { } });
        }
        if (pedidoAlta.cliente) {
            cliente_model_1.Cliente.findByIdAndUpdate(pedidoAlta.cliente, {
                $push: {
                    pedidos: pedidoAlta
                }
            }, (err, ok) => { if (err) { } });
        }
        pedido_model_1.Pedido.findById(pedidoGuardado._id)
            .populate('productos')
            .populate('cliente')
            .exec((err, pedidoEncontrado) => {
            if (err)
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el pedido' });
            return res.json(pedidoEncontrado);
        });
    });
};
exports.crearFoto = (req, res) => {
    var path = req.file.path.split('\\', 2)[1];
    pedido_model_1.Pedido.updateOne({ _id: req.params.id }, {
        $set: {
            foto: path
        }
    }).exec((err, pedidoActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo subir la foto' });
        return res.json(pedidoActualizado);
    });
};
exports.realizarVenta = (req, res) => {
    var hora = moment_1.default(new Date(Date.now())).format('YYYY-MM-DD');
    var fecha = moment_1.default(new Date(Date.now())).format('h:mm:ss a');
    const venta = new venta_model_1.Venta({
        pedido: req.body,
        fecha: fecha,
        hora: hora,
        vendedor: res.locals.usuario._id
    });
    venta.save((err, exito) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
        }
        return res.json(exito);
    });
    actualizarCantidadesCaja(Number(req.params.cantidadACaja), req.params.metodoPago, res);
};
exports.obtenerPedidosPorEmpleado = (req, res) => {
    usuario_model_1.Usuario.aggregate()
        .lookup({
        from: "pedidos",
        localField: "pedidosTomados",
        foreignField: "_id",
        as: "pedidosTomados"
    })
        .unwind({
        path: "$pedidosTomados",
        preserveNullAndEmptyArrays: true
    })
        .lookup({
        from: "clientes",
        localField: "pedidosTomados.cliente",
        foreignField: "_id",
        as: "cliente"
    })
        .lookup({
        from: "productos",
        localField: "pedidosTomados.productos",
        foreignField: "_id",
        as: "productos"
    })
        .match({
        $and: [
            { _id: mongoose_1.Types.ObjectId(req.params.id) },
            {
                $or: [
                    { "pedidosTomados.status": 'Vendido' },
                    { "pedidosTomados.status": 'Finalizado' }
                ]
            }
        ]
    })
        .project({
        _id: '$pedidosTomados._id',
        num_pedido: '$pedidosTomados.num_pedido',
        status: '$pedidosTomados.status',
        nombre_cliente: { $arrayElemAt: ['$cliente.nombre', 0] },
        ape_pat_cliente: { $arrayElemAt: ['$cliente.ape_pat', 0] },
        ape_mat_cliente: { $arrayElemAt: ['$cliente.ape_mat', 0] },
        fecha_creacion: '$pedidosTomados.fecha_creacion',
        fecha_entrega: '$pedidosTomados.fecha_entrega',
        comentarios: '$pedidosTomados.comentarios',
        total: '$pedidosTomados.total',
        anticipo: '$pedidosTomados.anticipo',
        foto: '$pedidosTomados.foto'
    })
        .group({
        _id: '$pedidosTomados._id',
        pedido: {
            $push: {
                _id: '$_id',
                num_pedido: '$num_pedido',
                status: '$status',
                fecha_creacion: '$fecha_creacion',
                fecha_entrega: '$fecha_entrega',
                comentarios: '$comentarios',
                cliente: {
                    $concat: ['$nombre_cliente', ' ', '$ape_pat_cliente', ' ', '$ape_mat_cliente']
                },
                anticipo: '$anticipo',
                total: '$total',
                foto: '$foto'
            }
        },
    })
        .exec((err, pedidos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' });
        if (pedidos.length > 0) {
            return res.json(pedidos);
        }
        else {
            return res.status(422).send({ titulo: 'No existen pedidos', detalles: 'El usuario no cuenta con ningun pedido realizado' });
        }
    });
};
exports.obtenerNumPedidosPorEmpleado = (req, res) => {
    usuario_model_1.Usuario.aggregate()
        .lookup({
        from: "pedidos",
        localField: "pedidosTomados",
        foreignField: "_id",
        as: "pedidosTomados"
    })
        .unwind({
        path: "$pedidosTomados",
        preserveNullAndEmptyArrays: true
    })
        .match({
        $and: [
            { _id: mongoose_1.Types.ObjectId(res.locals.usuario._id) },
            {
                $or: [
                    { "pedidosTomados.status": 'Vendido' },
                    { "pedidosTomados.status": 'Finalizado' }
                ]
            }
        ]
    })
        .group({
        _id: null,
        contador: {
            $sum: 1
        }
    })
        .project({
        _id: 0
    })
        .exec((err, pedidos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' });
        return res.json(pedidos);
    });
};
exports.obtenerPedidosEnProceso = (req, res) => {
    usuario_model_1.Usuario.aggregate()
        .lookup({
        from: "pedidos",
        localField: "pedidosTomados",
        foreignField: "_id",
        as: "pedidosTomados",
    })
        .unwind({
        path: "$pedidosTomados",
        preserveNullAndEmptyArrays: true
    })
        .lookup({
        from: "productos",
        localField: "pedidosTomados.productos",
        foreignField: "_id",
        as: "productos"
    })
        .lookup({
        from: "clientes",
        localField: "pedidosTomados.cliente",
        foreignField: "_id",
        as: "cliente"
    })
        .match({
        $and: [
            { _id: mongoose_1.Types.ObjectId(res.locals.usuario._id) },
            {
                $or: [
                    { "pedidosTomados.status": 'En retoque' },
                    { "pedidosTomados.status": 'Imprimiendo' },
                    { "pedidosTomados.status": 'Poniendo adherible' },
                    { "pedidosTomados.status": 'Cortando fotografias' }
                ]
            }
        ]
    })
        .project({
        _id: '$pedidosTomados._id',
        num_pedido: '$pedidosTomados.num_pedido',
        foto: '$pedidosTomados.foto',
        status: '$pedidosTomados.status',
        nombre_cliente: { $arrayElemAt: ['$cliente.nombre', 0] },
        ape_pat_cliente: { $arrayElemAt: ['$cliente.ape_pat', 0] },
        ape_mat_cliente: { $arrayElemAt: ['$cliente.ape_mat', 0] },
        fecha_creacion: '$pedidosTomados.fecha_creacion',
        fecha_entrega: '$pedidosTomados.fecha_entrega',
        comentarios: '$pedidosTomados.comentarios',
        total: '$pedidosTomados.total',
        anticipo: '$pedidosTomados.anticipo',
        c_ad: '$pedidosTomados.c_adherible',
        c_retoque: '$pedidosTomados.c_retoque',
        productos: '$pedidosTomados.productos'
    })
        .group({
        _id: '$pedidosTomados._id',
        pedido: {
            $push: {
                _id: '$_id',
                num_pedido: '$num_pedido',
                status: '$status',
                fecha_creacion: '$fecha_creacion',
                fecha_entrega: '$fecha_entrega',
                cliente: {
                    $concat: ['$nombre_cliente', ' ', '$ape_pat_cliente', ' ', '$ape_mat_cliente']
                },
                anticipo: '$anticipo',
                total: '$total',
                foto: '$foto',
                c_adherible: '$c_ad',
                c_retoque: '$c_retoque',
                comentarios: '$comentarios',
                productos: '$productos'
            }
        },
    })
        .exec((err, pedidos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' });
        if (pedidos.length > 0) {
            return res.json(pedidos);
        }
        else {
            return res.status(422).send({ titulo: 'No existen pedidos', detalles: 'El usuario no cuenta con ningun pedido realizandose' });
        }
    });
};
exports.obtenerNumPedidosEnProceso = (req, res) => {
    usuario_model_1.Usuario.aggregate()
        .lookup({
        from: "pedidos",
        localField: "pedidosTomados",
        foreignField: "_id",
        as: "pedidosTomados",
    })
        .unwind({
        path: "$pedidosTomados",
        preserveNullAndEmptyArrays: true
    })
        .match({
        $and: [
            { _id: mongoose_1.Types.ObjectId(res.locals.usuario._id) },
            {
                $or: [
                    { "pedidosTomados.status": 'En retoque' },
                    { "pedidosTomados.status": 'Imprimiendo' },
                    { "pedidosTomados.status": 'Poniendo adherible' },
                    { "pedidosTomados.status": 'Cortando fotografias' }
                ]
            }
        ]
    })
        .group({
        _id: null,
        contador: {
            $sum: 1
        }
    })
        .project({
        _id: 0
    })
        .exec((err, pedidos) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' });
        }
        return res.json(pedidos);
    });
};
exports.obtenerProductosPorPedido = (req, res) => {
    pedido_model_1.Pedido.findById(req.params.id)
        .populate('productos')
        .exec((err, pedido) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener los productos' });
        return res.json(pedido.productos);
    });
};
exports.obtenerFotografos = (req, res) => {
    usuario_model_1.Usuario.find({ rol: 0, rol_sec: 1 })
        .exec((err, fotografosEncontrados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los fotografos' });
        return res.json(fotografosEncontrados);
    });
};
exports.obtenerFotografo = (req, res) => {
    usuario_model_1.Usuario.findById(req.params.id)
        .exec((err, fotografo) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se encontro al fotografo' });
        return res.json(fotografo);
    });
};
exports.obtenerNotificaciones = (req, res) => {
    var fecha = new Date(req.params.fecha);
    notificacion_model_1.Notificacion.find({ $or: [{ usuario: req.params.id }, { usuario: null }], fecha: fecha })
        .sort({ num_pedido: -1 })
        .exec((err, notificaciones) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a las notificaciones' });
        return res.json(notificaciones);
    });
};
exports.obtenerPedidosEnCola = (req, res) => {
    pedido_model_1.Pedido.find({ fotografo: null })
        .populate('productos')
        .populate('cliente')
        .exec((err, pedidosEncontrados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los pedidos' });
        return res.json(pedidosEncontrados);
    });
};
exports.obtenerNumPedidosEnCola = (req, res) => {
    pedido_model_1.Pedido.find({ fotografo: null })
        .countDocuments()
        .exec((err, pedidosEncontrados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los pedidos' });
        return res.json(pedidosEncontrados);
    });
};
exports.tomarPedido = (req, res) => {
    pedido_model_1.Pedido.findOneAndUpdate({ _id: req.params.idPedido }, {
        fotografo: req.params.id,
        status: 'En retoque'
    }).exec((err, pedidoActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' });
        usuario_model_1.Usuario.updateOne({ _id: req.params.id }, {
            $push: {
                pedidosTomados: pedidoActualizado
            },
            $set: {
                ocupado: true,
            }
        }).exec((err, actualizado) => {
            if (err)
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' });
            if (actualizado) {
                pedido_model_1.Pedido.find({ fotografo: null }).exec((err, pedidos) => {
                    if (err)
                        return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' });
                    return res.json(pedidos);
                });
            }
        });
    });
};
exports.actualizarEstadoPedido = (req, res) => {
    pedido_model_1.Pedido.findOneAndUpdate({ _id: req.body._id }, {
        $set: {
            status: req.body.status
        }
    }).exec((err, pedidoActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' });
        pedido_model_1.Pedido.findById(pedidoActualizado._id).exec(function (err, pedido) {
            return res.json(pedido);
        });
    });
};
exports.actualizarAnticipoPedido = (req, res) => {
    pedido_model_1.Pedido.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            anticipo: req.params.anticipo
        }
    }).exec((err, pedidoActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' });
        pedido_model_1.Pedido.findById(pedidoActualizado._id).exec(function (err, pedido) {
            return res.json(pedido);
        });
    });
};
exports.eliminarNotificacion = (req, res) => {
    notificacion_model_1.Notificacion.findById(req.params.id)
        .exec((err, notificacion) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
        if (notificacion) {
            notificacion_model_1.Notificacion.deleteOne({ _id: req.params.id })
                .exec((err, eliminada) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
                if (eliminada)
                    return res.json({ titulo: 'Notificacion eliminada', detalles: 'Notificacion eliminada exitosamente' });
            });
        }
    });
};
exports.eliminarNotificacionPorPedido = (req, res) => {
    notificacion_model_1.Notificacion.findOne({ num_pedido: req.params.num })
        .exec((err, notificacion) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
        if (notificacion) {
            notificacion_model_1.Notificacion.deleteOne({ _id: req.params.id })
                .exec((err, eliminada) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
                if (eliminada)
                    return res.json({ titulo: 'Notificacion eliminada', detalles: 'Notificacion eliminada exitosamente' });
            });
        }
    });
};
exports.eliminarNotificaciones = () => {
    notificacion_model_1.Notificacion.deleteMany({})
        .exec((err, eliminadas) => { if (err) { } if (eliminadas) { } });
};
exports.actualizarOcupado = (req, res) => {
    usuario_model_1.Usuario.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            ocupado: false
        }
    }).exec((err, actualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el estado del fotografo' });
        if (actualizado)
            return res.json({ titulo: 'Usuario actualizado', detalles: 'Usuario actualizado correctamente' });
    });
};
exports.obtenerPedidos = (req, res) => {
    pedido_model_1.Pedido.find().exec((err, pedidos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener todos los pedidos' });
        return res.json(pedidos);
    });
};
exports.actualizarCaja = (req, res) => {
    actualizarCantidadesCaja(Number(req.params.cantidadACaja), req.params.metodoPago, res);
};
exports.fotografoMiddleware = (req, res, next) => {
    if (res.locals.usuario.rol !== 0 && res.locals.rol_sec !== 1) {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para crear un pedido' });
    }
    else {
        next();
    }
};
exports.recepcionistaMiddleware = (req, res, next) => {
    if (res.locals.usuario.rol == 0 && res.locals.usuario.rol_sec == 2) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para crear un pedido' });
    }
};
/* Funciones auxiliares */
function actualizarCantidadesCaja(cantidad, metodoPago, res) {
    let cantidadSuma = cantidad;
    switch (metodoPago) {
        case 'efectivo':
            caja_model_1.Caja.findOne().exec((err, caja) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                let cajaCantidad = caja.cantidadTotal + cantidadSuma;
                let cajaEfectivo = caja.cantidadEfectivo + cantidadSuma;
                caja_model_1.Caja.updateOne({ _id: caja._id }, { cantidadTotal: cajaCantidad, cantidadEfectivo: cajaEfectivo })
                    .exec((err, cajaActualizada) => {
                    if (err)
                        return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                });
            });
            break;
        case 'tarjeta':
            caja_model_1.Caja.findOne().exec((err, caja) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                let cajaCantidad = caja.cantidadTotal + cantidadSuma;
                let cajaTarjetas = caja.cantidadTarjetas + cantidadSuma;
                caja_model_1.Caja.updateOne({ _id: caja._id }, { cantidadTotal: cajaCantidad, cantidadTarjetas: cajaTarjetas })
                    .exec((err, cajaActualizada) => {
                    if (err)
                        return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                });
            });
            break;
    }
}
