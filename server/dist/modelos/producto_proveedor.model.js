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
const productoProveedorSchema = new mongoose_1.Schema({
    id: { type: Number, required: false },
    codigoBarras: { type: String, required: true },
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    proveedor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Proveedor' },
    detalles: { type: String, required: true },
    existencias: { type: Number, default: 0, required: true },
    almacen: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Almacen' },
    historialMov: {
        type: [
            {
                fecha: { type: Date, required: false, default: new Date(Date.now()) },
                numFactura: { type: Number, required: false },
                usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario', required: true },
                tipo: { type: String, required: true },
                cantidadMovimiento: { type: Number, required: false }
            }
        ]
    },
    //traspasos
    activo: { type: Number, default: 1 }
});
productoProveedorSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'ProductoProveedor', field: 'id' });
exports.ProductoProveedor = mongoose_1.default.model('ProductoProveedor', productoProveedorSchema);
