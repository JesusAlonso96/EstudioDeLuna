const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const sucursalSchema = new Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    almacen: { type: Schema.Types.ObjectId, ref: 'Almacen' },
    activa: { type: Boolean, required: true, default: 1 }
});



module.exports = mongoose.model('Sucursal', sucursalSchema);