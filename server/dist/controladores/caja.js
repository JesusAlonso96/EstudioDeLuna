"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const caja_model_1 = require("../modelos/caja.model");
const corte_caja_model_1 = require("../modelos/corte_caja.model");
const moment_1 = __importDefault(require("moment"));
exports.obtenerCajas = (req, res) => {
    caja_model_1.Caja.find({ activa: true, sucursal: res.locals.usuario.sucursal })
        .populate('sucursal')
        .exec((err, cajas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener las cajas, por favor intentelo de nuevo mas tarde' });
        return res.json(cajas);
    });
};
exports.obtenerCajasEliminadas = (req, res) => {
    caja_model_1.Caja.find({ activa: false, sucursal: res.locals.usuario.sucursal })
        .populate('sucursal')
        .exec((err, cajas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener las cajas, por favor intentelo de nuevo mas tarde' });
        return res.json(cajas);
    });
};
exports.obtenerCaja = (req, res) => {
    caja_model_1.Caja.findById(req.params.id)
        .populate('sucursal')
        .exec((err, caja) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener la caja, por favor intentelo de nuevo mas tarde' });
        return res.json(caja);
    });
};
exports.agregarCaja = (req, res) => {
    const caja = new caja_model_1.Caja(req.body);
    caja.sucursal = res.locals.usuario.sucursal;
    caja.save((err, caja) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al guardar', detalles: 'Ocurrio un error al guardar la caja, por favor intentelo de nuevo mas tarde' });
        caja_model_1.Caja.findById(caja._id)
            .populate('sucursal')
            .exec((err, caja) => {
            return res.json(caja);
        });
    });
};
exports.eliminarCaja = (req, res) => {
    const caja = new caja_model_1.Caja(req.body);
    caja_model_1.Caja.findByIdAndUpdate(caja._id, {
        activa: false
    })
        .exec((err, cajaEliminada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al eliminar caja', detalles: 'Ocurrio un error al eliminar la caja, por favor intentalo de nuevo mas tarde' });
        if (cajaEliminada)
            return res.status(200).send({ titulo: 'Caja eliminada', detalles: 'Se ha eliminado satisfactoriamente la caja' });
    });
};
exports.restaurarCaja = (req, res) => {
    const caja = new caja_model_1.Caja(req.body);
    caja_model_1.Caja.findByIdAndUpdate(caja._id, {
        activa: true
    })
        .exec((err, cajaEliminada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al restaurar caja', detalles: 'Ocurrio un error al restaurar la caja, por favor intentalo de nuevo mas tarde' });
        if (cajaEliminada)
            return res.status(200).send({ titulo: 'Caja restaurada', detalles: 'Se ha restaurado satisfactoriamente la caja' });
    });
};
exports.actualizarCaja = (req, res) => {
    caja_model_1.Caja.findOneAndUpdate({ _id: req.params._id }, {
        cantidadTotal: req.body.cantidadTotal,
        cantidadEfectivo: req.body.cantidadEfectivo,
        cantidadTarjetas: req.body.cantidadTarjetas
    })
        .exec((err, cajaActualizada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar la caja', tipo: 2 });
        return res.json(cajaActualizada);
    });
};
exports.existeCorteCaja = (req, res) => {
    const fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    corte_caja_model_1.CorteCaja.findOne({ caja: req.params.id, fecha }).exec((err, corte) => {
        if (err) {
            console.log(err);
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo verificar la existencia del corte de caja', tipo: 2 });
        }
        if (corte) {
            return res.json({ encontrado: true });
        }
        else {
            return res.json({ encontrado: false });
        }
    });
};
exports.crearCorteCaja = (req, res) => {
    var fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    var hora = moment_1.default(new Date()).format('h:mm:ss a');
    const corte = new corte_caja_model_1.CorteCaja({
        fecha,
        hora,
        usuario: res.locals.usuario,
        efectivoEsperado: req.body.efectivoEsperado,
        tarjetaEsperado: req.body.tarjetaEsperado,
        efectivoContado: req.body.efectivoContado,
        tarjetaContado: req.body.tarjetaContado,
        fondoEfectivo: req.body.fondoEfectivo,
        fondoTarjetas: req.body.fondoTarjetas,
        sucursal: res.locals.usuario.sucursal,
        caja: req.body.caja
    });
    corte.save((err, guardado) => {
        if (err) {
            console.log(err);
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el corte de caja', tipo: 2 });
        }
        return res.status(200).json(guardado);
    });
};
exports.obtenerCortesCaja = (req, res) => {
    corte_caja_model_1.CorteCaja.find({ caja: req.params.id })
        .sort({
        num_corte: 'desc'
    })
        .exec((err, cortesCaja) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener cortes de caja', detalles: 'Ocurrio un error al obtener los cortes de caja, por favor intentalo de nuevo' });
        return res.status(200).json(cortesCaja);
    });
};
