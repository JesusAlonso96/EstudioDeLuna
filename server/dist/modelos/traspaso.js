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
const traspasoSchema = new mongoose_1.Schema({
    id: { type: Number, required: false },
    almacenOrigen: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Almacen', required: false },
    almacenDestino: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Almacen', required: false },
    insumo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ProductoProveedor', required: true },
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    estado: { type: String, required: true },
    cantidadMovimiento: { type: Number, required: true },
    observaciones: { type: String, required: false },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Boolean, required: true, default: true }
});
traspasoSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'Traspaso', field: 'id' });
exports.Traspaso = mongoose_1.default.model('Traspaso', traspasoSchema);
