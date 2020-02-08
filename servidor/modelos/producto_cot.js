const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const producto_cotSchema = new Schema({
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true }
});


module.exports = mongoose.model('Producto_cot', producto_cotSchema);