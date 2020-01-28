const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const familiaSchema = new Schema({
    nombre: { type: String, required: true },
    productos: [{ type: mongoose.Types.ObjectId, ref: 'Producto' }],
    activa: { type: Number, default: 1 }
});



module.exports = mongoose.model('Familia', familiaSchema);