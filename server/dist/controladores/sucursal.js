"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sucursal_model_1 = require("../modelos/sucursal.model");
const almacen_model_1 = require("../modelos/almacen.model");
exports.obtenerSucursales = (req, res) => {
    sucursal_model_1.Sucursal.find({ activa: true })
        .exec((err, sucursales) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener las sucursales', detalles: 'No se pudieron obtener las sucursales, intentalo de nuevo mas tarde' });
        return res.status(200).json(sucursales);
    });
};
exports.obtenerAlmacenesSucursal = (req, res) => {
    almacen_model_1.Almacen.find({ activo: true, sucursal: req.params.id })
        .exec((err, almacenes) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener los almacenes', detalles: 'No se pudieron obtener los almacenes, intentalo de nuevo mas tarde' });
        return res.status(200).json(almacenes);
    });
};
