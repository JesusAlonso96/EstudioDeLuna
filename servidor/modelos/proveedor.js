const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const proveedorSchema = new Schema({
    nombre: { type: String, required: true },
    rfc: { type: String, required: true },
    email: { type: String, required: true },
    ciudad: { type: String, required: true },
    estado: { type: String, required: true },
    telefono: { type: Number, required: true },
    direccion: { type: String, required: true },
    colonia: { type: String, required: true },
    cp: { type: Number, required: true },
    num_ext: { type: Number, required: true },
    num_int: { type: Number, required: false },
    productos: [{ type: Schema.Types.ObjectId, ref: 'ProductoProveedor', default: [] }],
    activo: { type: Number, default: 1 }

});

module.exports = mongoose.model('Proveedor', proveedorSchema);