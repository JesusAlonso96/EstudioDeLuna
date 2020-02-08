const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const datos_estudioSchema = new Schema({
    nombre: { type: String, required: true },
    telefono: { type: Number, required: true },
    direccion: {type: String, required:true}
});


module.exports = mongoose.model('Datos_estudio', datos_estudioSchema);