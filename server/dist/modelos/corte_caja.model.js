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
const CorteCajaSchema = new mongoose_1.Schema({
    num_corte: { type: Number },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    usuario: { type: mongoose_1.default.Types.ObjectId, ref: 'Usuario' },
    efectivoEsperado: { type: Number, required: true },
    tarjetaEsperado: { type: Number, required: true },
    efectivoContado: { type: Number, required: true },
    tarjetaContado: { type: Number, required: true },
    fondoEfectivo: { type: Number, required: true },
    fondoTarjetas: { type: Number, required: true },
    sucursal: { type: mongoose_1.default.Types.ObjectId, ref: 'Sucursal' },
    caja: { type: mongoose_1.default.Types.ObjectId, ref: 'Caja' }
});
CorteCajaSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'Corte_caja', field: 'num_corte' });
exports.CorteCaja = mongoose_1.default.model('CorteCaja', CorteCajaSchema);
