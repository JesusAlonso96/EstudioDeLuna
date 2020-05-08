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
const inventarioSchema = new mongoose_1.Schema({
    id: { type: Number, required: false },
    insumos: {
        type: [
            {
                insumo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ProductoProveedor' },
                existenciaEsperada: { type: Number, required: true },
                existenciaReal: { type: Number, required: true },
                revisado: { type: Boolean, required: true },
                observaciones: { type: String, required: false }
            }
        ]
    },
    sucursal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sucursal' },
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' },
    almacen: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Almacen' },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Boolean, required: true, default: true }
});
inventarioSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'Inventario', field: 'id' });
exports.Inventario = mongoose_1.default.model('Inventario', inventarioSchema);
