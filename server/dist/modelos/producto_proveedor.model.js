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
const productoProveedorSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    proveedor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Proveedor' },
    detalles: { type: String, required: true },
    existencias: { type: Number, default: 0, required: true },
    almacen: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Almacen' },
    activo: { type: Number, default: 1 }
});
exports.ProductoProveedor = mongoose_1.default.model('ProductoProveedor', productoProveedorSchema);
