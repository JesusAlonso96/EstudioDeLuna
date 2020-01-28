const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

const clienteSchema = new Schema({
    nombre: { type: String, required: true },
    username: { type: String, required: false },
    ape_pat: { type: String, required: true },
    ape_mat: { type: String, required: true },
    email: { type: String, required: false },
    telefono: { type: Number, required: false },
    contrasena: { type: String, required: true },
    razonSocial: { type: String, required: false },
    rfc: { type: String, required: false },//en caso de querer factura
    direccion: { type: String, required: true },
    colonia: { type: String, required: true },
    municipio: { type: String, required: true },
    estado: { type: String, required: true },
    cp: { type: Number, required: true },
    num_ext: { type: Number, required: true },
    num_int: { type: Number, required: false },
    pedidos: [{ type: Schema.Types.ObjectId, ref: 'Pedido' }],
    fecha_registro: { type: Date, required: true },
    activo: { type: Number, default: 1 }

});

module.exports = mongoose.model('Cliente', clienteSchema);