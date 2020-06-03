"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_model_1 = require("../modelos/usuario.model");
const mongoose_1 = require("mongoose");
const pedido_model_1 = require("../modelos/pedido.model");
const moment_1 = __importDefault(require("moment"));
const venta_model_1 = require("../modelos/venta.model");
const caja_model_1 = require("../modelos/caja.model");
const notificacion_model_1 = require("../modelos/notificacion.model");
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: 'j.alonso.jacl2@gmail.com',
        pass: 'papanatas.1234'
    }
});
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
        sucursal: mongoose_1.Types.ObjectId(res.locals.usuario.sucursal),
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
exports.crearFoto = (req, res) => {
    var path = req.file.path.split('\\', 2)[1];
    pedido_model_1.Pedido.updateOne({ _id: req.params.id }, {
        $set: {
            foto: path
        }
    }).exec((err, pedidoActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al subir la imagen, por favor intentalo de nuevo' });
        return res.status(200).json(pedidoActualizado);
    });
};
exports.realizarVenta = (req, res) => {
    var fecha = moment_1.default(new Date(Date.now())).format('YYYY-MM-DD');
    var hora = moment_1.default(new Date(Date.now())).format('h:mm:ss a');
    const venta = new venta_model_1.Venta({
        pedido: req.body,
        fecha: fecha,
        hora: hora,
        vendedor: res.locals.usuario._id,
        sucursal: res.locals.usuario.sucursal
    });
    venta.save((err, exito) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
        actualizarCantidadesCaja(req.params.id, Number(req.params.cantidadACaja), req.params.metodoPago, res);
        return res.json(exito);
    });
};
exports.obtenerFotografos = (req, res) => {
    usuario_model_1.Usuario.find({ rol: 0, rol_sec: 1, sucursal: res.locals.usuario.sucursal })
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
exports.actualizarCaja = (req, res) => {
    actualizarCantidadesCaja(req.params.id, Number(req.params.cantidadACaja), req.params.metodoPago, res);
};
/* Funciones auxiliares */
function actualizarCantidadesCaja(idCaja, cantidad, metodoPago, res) {
    let cantidadSuma = cantidad;
    switch (metodoPago) {
        case 'efectivo':
            caja_model_1.Caja.findById(idCaja).exec((err, caja) => {
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
            caja_model_1.Caja.findById(idCaja).exec((err, caja) => {
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
exports.actualizarCantidadesCaja = actualizarCantidadesCaja;
