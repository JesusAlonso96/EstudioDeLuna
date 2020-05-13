"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empresa_cot_model_1 = require("../modelos/empresa_cot.model");
const cotizacion_model_1 = require("../modelos/cotizacion.model");
exports.obtenerEmpresas = (req, res) => {
    empresa_cot_model_1.EmpresaCot.find({ activa: 1, sucursal: res.locals.usuario.sucursal })
        .exec((err, empresas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las empresas' });
        return res.json(empresas);
    });
};
exports.nuevaEmpresa = (req, res) => {
    const nuevaEmpresa = new empresa_cot_model_1.EmpresaCot(req.body);
    nuevaEmpresa.sucursal = res.locals.usuario.sucursal;
    nuevaEmpresa.save((err, guardada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la empresa' });
        if (guardada)
            return res.json({ titulo: 'Empresa agregada', detalles: 'Empresa agregada exitosamente' });
    });
};
exports.eliminarEmpresa = (req, res) => {
    empresa_cot_model_1.EmpresaCot.findByIdAndUpdate(req.body._id, {
        activa: 0
    })
        .exec((err, eliminada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar la empresa' });
        if (eliminada)
            return res.json({ titulo: 'Empresa eliminada', detalles: 'Empresa eliminada exitosamente' });
    });
};
exports.editarEmpresa = (req, res) => {
    empresa_cot_model_1.EmpresaCot.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        contacto: req.body.contacto,
        telefono: req.body.telefono,
        email: req.body.email,
        activa: req.body.activa
    })
        .exec((err, actualizada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar la empresa' });
        if (actualizada)
            return res.json({ titulo: 'Empresa actualizada', detalles: 'Empresa actualizada exitosamente' });
    });
};
exports.nuevaCotizacion = (req, res) => {
    const cotizacion = new cotizacion_model_1.Cotizacion(req.body);
    cotizacion.sucursal = res.locals.usuario.sucursal;
    cotizacion.save((err, cotizacionGuardada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la cotizacion' });
        cotizacion_model_1.Cotizacion.findById(cotizacionGuardada._id)
            .populate({ path: 'asesor', select: 'nombre ape_pat ape_mat email' })
            .populate('empresa')
            .populate('productos.producto')
            .exec((err, cotizacion) => {
            if (err)
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la cotizacion' });
            return res.status(201).json(cotizacion);
        });
    });
};
exports.obtenerCotizaciones = (req, res) => {
    cotizacion_model_1.Cotizacion.find({ sucursal: res.locals.usuario.sucursal }, { __v: 0 })
        .where({
        vigencia: {
            $gte: new Date().getFullYear()
        }
    })
        .populate('productos.producto', '-activo -caracteristicas -__v -familia -c_ad -c_r -b_n -nombre -num_fotos')
        .populate('asesor', '-_id -__v -ape_mat -asistencia -ocupado -pedidosTomados -activo -username -contrasena -rol -rol_sec')
        .populate('empresa', '-_id -activa -__v')
        .populate('datos', '-_id -__v')
        .sort({ num_cotizacion: 'desc' })
        .exec((err, cotizaciones) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la cotizacion' });
        return res.json(cotizaciones);
    });
};
