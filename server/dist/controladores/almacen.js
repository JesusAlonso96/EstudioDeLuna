"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const almacen_model_1 = require("../modelos/almacen.model");
exports.obtenerAlmacenes = (req, res) => {
    almacen_model_1.Almacen.find({ activo: true, sucursal: res.locals.usuario.sucursal })
        .exec((err, almacenes) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los almacenes, intentalo de nuevo mas tarde' });
        return res.status(200).json(almacenes);
    });
};
exports.obtenerAlmacenesEliminados = (req, res) => {
    almacen_model_1.Almacen.find({ activo: false, sucursal: res.locals.usuario.sucursal })
        .exec((err, almacenes) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los almacenes, intentalo de nuevo mas tarde' });
        return res.status(200).json(almacenes);
    });
};
exports.obtenerAlmacenPorId = (req, res) => {
    almacen_model_1.Almacen.findById(req.params.id)
        .exec((err, almacen) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener el almacen, intentalo de nuevo mas tarde' });
        return res.status(200).json(almacen);
    });
};
exports.nuevoAlmacen = (req, res) => {
    const nuevoAlmacen = new almacen_model_1.Almacen(req.body);
    nuevoAlmacen.sucursal = res.locals.usuario.sucursal;
    nuevoAlmacen.save((err, almacen) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al guardar', detalles: 'No se pudo guardar el almacen, intentalo de nuevo mas tarde' });
        return res.status(200).send(almacen);
    });
};
exports.editarAlmacen = (req, res) => {
    const almacen = new almacen_model_1.Almacen(req.body);
    if (!almacen.nombre)
        return res.status(422).send({ titulo: 'Campo nombre obligatorio', detalles: 'Por favor, ingresa el campo nombre' });
    if (!almacen.direccion.calle)
        return res.status(422).send({ titulo: 'Campo calle obligatorio', detalles: 'Por favor, ingresa el campo calle' });
    if (!almacen.direccion.colonia)
        return res.status(422).send({ titulo: 'Campo colonia obligatorio', detalles: 'Por favor, ingresa el campo colonia' });
    if (!almacen.direccion.num_ext)
        return res.status(422).send({ titulo: 'Campo numero exterior obligatorio', detalles: 'Por favor, ingresa el campo numero exterior' });
    if (!almacen.direccion.cp)
        return res.status(422).send({ titulo: 'Campo codigo postal obligatorio', detalles: 'Por favor, ingresa el campo codigo postal' });
    if (!almacen.direccion.ciudad)
        return res.status(422).send({ titulo: 'Campo ciudad obligatorio', detalles: 'Por favor, ingresa el campo ciudad' });
    if (!almacen.direccion.estado)
        return res.status(422).send({ titulo: 'Campo estado obligatorio', detalles: 'Por favor, ingresa el campo estado' });
    almacen_model_1.Almacen.findByIdAndUpdate(req.params.id, {
        id: almacen.id,
        nombre: almacen.nombre,
        direccion: almacen.direccion,
        insumos: almacen.insumos,
        fechaRegistro: almacen.fechaRegistro,
        activo: almacen.activo
    })
        .exec((err, almacen) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
        if (almacen)
            return res.status(200).json({ titulo: 'Almacen actualizado', detalles: `El almacen ${almacen.id} ha sido actualizado exitosamente` });
    });
};
exports.eliminarAlmacen = (req, res) => {
    almacen_model_1.Almacen.findByIdAndUpdate(req.params.id, {
        activo: false
    })
        .exec((err, almacen) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
        if (almacen)
            return res.status(200).json({ titulo: 'Almacen actualizado', detalles: `El almacen ${almacen.id} ha sido eliminado exitosamente` });
    });
};
exports.restaurar = (req, res) => {
    almacen_model_1.Almacen.findByIdAndUpdate(req.params.id, {
        activo: true
    })
        .exec((err, almacen) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
        if (almacen)
            return res.status(200).json({ titulo: 'Almacen actualizado', detalles: `El almacen ${almacen.id} ha sido restaurado exitosamente` });
    });
};
