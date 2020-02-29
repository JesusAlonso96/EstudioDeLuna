"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datos_estudio_model_1 = require("../modelos/datos_estudio.model");
exports.obtenerDatos = (req, res) => {
    datos_estudio_model_1.DatosEstudio.findOne()
        .exec((err, datos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener los datos de la empresa, intentalo de nuevo mas tarde' });
        return res.status(200).json(datos);
    });
};
