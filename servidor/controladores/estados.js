const Estado = require('../modelos/estado'),
    Municipio = require('../modelos/municipio');

exports.obtenerEstados = function (req, res) {
    Estado.find()
        .exec(function (err, estados) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los estados' });
            }
            return res.json(estados);
        })
}
exports.obtenerMunicipios = function (req, res) {
    Municipio.find({ estado: req.params.id })
        .exec(function (err, municipios) {
            if (err) {
                console.log(err);
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los municipios' });
            }
            return res.json(municipios);
        })
}