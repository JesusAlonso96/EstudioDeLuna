const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const almacenSchema = new Schema({
    productos: [{ type: Schema.Types.ObjectId, ref: 'ProductoProveedor' }]
});



module.exports = mongoose.model('Almacen', almacenSchema);