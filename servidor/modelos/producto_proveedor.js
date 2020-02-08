const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const productoProveedorSchema = new Schema({
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    detalles: { type: String, required: true },
    existencias: { type: Number, default: 0, required: true },
    almacen: { type: Schema.Types.ObjectId, ref: 'Almacen' },
    activo: { type: Number, default: 1 }
});



module.exports = mongoose.model('ProductoProveedor', productoProveedorSchema);