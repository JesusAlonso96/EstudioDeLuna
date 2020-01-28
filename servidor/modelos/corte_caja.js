const mongoose = require('mongoose'),
    config = require('../configuracion/dev'),
    Schema = mongoose.Schema,
    autoIncrementable = require('mongoose-auto-increment');


mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(config.DB_URL, { useNewUrlParser: true });
autoIncrementable.initialize(conexion);

const CorteCajaSchema = new Schema({
    num_corte: { type: Number },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    efectivoEsperado: { type: Number, required: true },
    tarjetaEsperado: { type: Number, required: true },
    efectivoContado: { type: Number, required: true },
    tarjetaContado: { type: Number, required: true },
    fondoEfectivo: { type: Number, required: true },
    fondoTarjetas: { type: Number, required: true }
});

CorteCajaSchema.plugin(autoIncrementable.plugin, { model: 'Corte_caja', field: 'num_corte' });
module.exports = mongoose.model('Corte_caja', CorteCajaSchema);