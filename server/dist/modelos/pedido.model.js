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
const pedidoSchema = new mongoose_1.Schema({
    num_pedido: { type: Number },
    fotografo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' },
    cliente: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cliente' },
    fecha_creacion: { type: Date, required: true },
    fecha_entrega: { type: Date },
    comentarios: { type: String },
    productos: {
        type: [
            {
                producto: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Producto' },
                precioUnitario: { type: Number, required: true },
                cantidad: { type: Number, required: true },
            }
        ]
    },
    status: { type: String },
    total: { type: Number },
    c_retoque: { type: Boolean },
    c_adherible: { type: Boolean },
    importante: { type: Boolean },
    anticipo: { type: Number },
    foto: { type: String },
    metodoPago: { type: String },
    sucursal: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Sucursal' }],
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' }
});
pedidoSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'Pedido', field: 'num_pedido' });
exports.Pedido = mongoose_1.default.model('Pedido', pedidoSchema);
