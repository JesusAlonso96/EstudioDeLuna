const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CajaSchema = new Schema({
    cantidadTotal: { type: Number, required: true },
    cantidadEfectivo: { type: Number, required: true },
    cantidadTarjetas: {type: Number, required:true}
});

module.exports = mongoose.model('Caja', CajaSchema);