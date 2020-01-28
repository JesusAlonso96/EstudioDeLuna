const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ventaSchema = new Schema({
    pedido: { type: Schema.Types.ObjectId, ref:'Pedido' },
    fecha: {type: Date, required:true},
    hora: {type: String, required:true},
    vendedor: { type: Schema.Types.ObjectId, ref:'Usuario' }
});


module.exports = mongoose.model('Venta', ventaSchema);