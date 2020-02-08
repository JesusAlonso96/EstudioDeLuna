const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrementable = require('mongoose-auto-increment'),
    config = require('../configuracion/index');



mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(config.DB_URL, { useNewUrlParser: true });
autoIncrementable.initialize(conexion);

const cotizacionSchema = new Schema({
    num_cotizacion: { type: Number },
    fecha: { type: Date, required: true },
    vigencia: { type: Number, required: true },
    asesor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    empresa: { type: Schema.Types.ObjectId, ref: 'Empresa_cot' },
    datos: { type: Schema.Types.ObjectId, ref: 'Datos_estudio' },
    productos: [{ 
        producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
        cantidad: { type: Number, required: true }
     }],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    iva: { type: Number, required: true },
    forma_pago: { type: String, required: false },
    fecha_entrega: { type: Date, required: true },
    fecha_evento: { type: Date, required: false }

});

cotizacionSchema.plugin(autoIncrementable.plugin, { model: 'Cotizacion', field: 'num_cotizacion' })
module.exports = mongoose.model('Cotizacion', cotizacionSchema);