const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const empresa_cotSchema = new Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    contacto: { type: String, required: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    activa: { type: Number, required: true, default: 1 }
});


module.exports = mongoose.model('Empresa_cot', empresa_cotSchema);