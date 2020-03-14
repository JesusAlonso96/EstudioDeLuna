"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const compraSchema = new mongoose_1.Schema({
    id: { type: Number, required: false },
    fecha: { type: Date, required: false },
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' },
    proveedor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Proveedor' },
    almacen: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Almancen' },
    numFactura: { type: Number, required: true },
    insumosCompra: {
        type: [
            {
                insumo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ProductoProveedor' },
                cantidad: { type: Number, required: true },
                subtotal: { type: Number, required: true }
            }
        ], required: true
    },
    subtotal: { type: Number, required: true },
    iva: { type: Number, required: true },
    costoEnvio: { type: Number, required: true },
    metodoPago: { type: Number, required: false },
    total: { type: Number, required: true },
    sucursal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sucursal' }
});
exports.Compra = mongoose_1.default.model('Compra', compraSchema);
