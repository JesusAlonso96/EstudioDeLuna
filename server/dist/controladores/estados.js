"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estado_model_1 = require("../modelos/estado.model");
const municipio_model_1 = require("../modelos/municipio.model");
exports.obtenerEstados = (req, res) => {
    estado_model_1.Estado.find()
        .exec((err, estados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los estados' });
        return res.json(estados);
    });
};
exports.obtenerMunicipios = (req, res) => {
    municipio_model_1.Municipio.find({ estado: req.params.id })
        .exec((err, municipios) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los municipios' });
        return res.json(municipios);
    });
};
