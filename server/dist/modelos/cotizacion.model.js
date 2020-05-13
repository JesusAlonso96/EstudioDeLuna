"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_auto_increment_1 = __importDefault(require("mongoose-auto-increment"));
const environment_1 = require("../global/environment");
mongoose_1.default.set('useUnifiedTopology', true);
var conexion = mongoose_1.default.createConnection(environment_1.environment.DB_URL, { useNewUrlParser: true });
mongoose_auto_increment_1.default.initialize(conexion);
const cotizacionSchema = new mongoose_1.Schema({
    num_cotizacion: { type: Number },
    fechaRegistro: { type: Date, required: true, default: new Date(Date.now()) },
    vigencia: { type: Number, required: true },
    asesor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' },
    empresa: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Empresa_cot' },
    productos: [{
            producto: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Producto', required: true },
            precioUnitario: { type: Number, required: true },
            cantidad: { type: Number, required: true }
        }],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    iva: { type: Number, required: true },
    forma_pago: { type: String, required: false },
    fecha_entrega: { type: Date, required: true },
    fecha_evento: { type: Date, required: false },
    sucursal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
}, {
    collection: 'cotizaciones'
});
cotizacionSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'Cotizacion', field: 'num_cotizacion' });
exports.Cotizacion = mongoose_1.default.model('Cotizacion', cotizacionSchema);
