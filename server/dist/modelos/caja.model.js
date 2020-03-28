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
const cajaSchema = new mongoose_1.Schema({
    id: { type: Number, required: false },
    cantidadTotal: { type: Number, required: true, default: 0 },
    cantidadEfectivo: { type: Number, required: true, default: 0 },
    cantidadTarjetas: { type: Number, required: true, default: 0 },
    historialEgresosIngresos: {
        type: [
            {
                id: { type: Number, required: false },
                fecha: { type: Date, required: false, default: new Date(Date.now()) },
                usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' },
                tipo: { type: String, required: true },
                descripcion: { type: String, required: true },
                cantidadSalida: { type: Number, required: false },
                cantidadEntrada: { type: Number, required: false },
                sucursal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sucursal' }
            }
        ], default: []
    },
    sucursal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sucursal' },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activa: { type: Boolean, required: false, default: true }
});
cajaSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'Caja', field: 'id' });
exports.Caja = mongoose_1.default.model('Caja', cajaSchema);
