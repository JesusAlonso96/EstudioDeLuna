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
const ordenCompraSchema = new mongoose_1.Schema({
    id: { type: Number, required: false },
    proveedor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Proveedor', required: true },
    fechaPedido: { type: Date, required: true },
    fechaEntrega: { type: Date, required: true },
    terminosEntrega: { type: String, required: false },
    terminosPago: { type: String, required: false },
    lugarEntrega: { type: String, required: false },
    subtotal: { type: Number, required: true },
    iva: { type: Number, required: true },
    total: { type: Number, required: true },
    costoEnvio: { type: Number, required: false },
    productosOrdenCompra: {
        type: [
            {
                insumo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ProductoProveedor', required: true },
                cantidadOrden: { type: Number, required: true }
            }
        ], required: true
    }
});
ordenCompraSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'OrdenCompra', field: 'id' });
exports.OrdenCompra = mongoose_1.default.model('OrdenCompra', ordenCompraSchema);
