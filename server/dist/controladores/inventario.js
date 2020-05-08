"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inventario_model_1 = require("../modelos/inventario.model");
exports.obtenerInventarios = (req, res) => {
    inventario_model_1.Inventario.find({ activo: true, sucursal: res.locals.usuario.sucursal })
        .populate({ path: 'almacen', select: 'id nombre' })
        .populate({ path: 'usuario', select: 'id nombre apepat apemat' })
        .exec((err, inventarios) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los inventarios, intentalo de nuevo mas tarde' });
        return res.status(200).json(inventarios);
    });
};
exports.obtenerInventarioPorId = (req, res) => {
    inventario_model_1.Inventario.findById(req.params.id)
        .populate({ path: 'insumos.insumo', select: 'id codigoBarras nombre detalles' })
        .exec((err, inventario) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudo obtener el inventario, intentalo de nuevo mas tarde' });
        return res.status(200).json(inventario);
    });
};
exports.nuevoInventario = (req, res) => {
    const nuevoInventario = new inventario_model_1.Inventario(req.body);
    nuevoInventario.usuario = res.locals.usuario._id;
    nuevoInventario.sucursal = res.locals.usuario.sucursal;
    nuevoInventario.save((err, inventario) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al guardar', detalles: 'No se pudo guardar el inventario, intentalo de nuevo mas tarde' });
        return res.status(200).send(inventario);
    });
};
