const mongoose = require('mongoose'),
    config = require('../configuracion/dev'),
    Schema = mongoose.Schema,
    autoIncrementable = require('mongoose-auto-increment');


mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(config.DB_URL, { useNewUrlParser: true });
autoIncrementable.initialize(conexion);

const pedidoSchema = new Schema({
    num_pedido: { type: Number },//
    fotografo: { type: Schema.Types.ObjectId, ref: 'Usuario' },//
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },//
    fecha_creacion: { type: Date, required: true },//
    fecha_entrega: { type: Date },//
    comentarios: { type: String },//
    productos: [{ type: Schema.Types.ObjectId, ref: 'Producto' }],//
    status: { type: String },
    total: { type: Number },//
    c_retoque: { type: Boolean },//
    c_adherible: { type: Boolean },//
    importante: { type: Boolean },//
    anticipo: { type: Number },//
    foto: { type: String },
    metodoPago: { type: String }
});
pedidoSchema.plugin(autoIncrementable.plugin, { model: 'Pedido', field: 'num_pedido' });
module.exports = mongoose.model('Pedido', pedidoSchema);