const express = require('express'),
      ruta = express.Router(),
      Estados = require('../controladores/estados');

ruta.get('/estados', Estados.obtenerEstados);
ruta.get('/municipios/:id', Estados.obtenerMunicipios);


module.exports = ruta;