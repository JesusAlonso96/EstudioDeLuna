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
const proveedorSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    rfc: { type: String, required: true },
    email: { type: String, required: true },
    ciudad: { type: String, required: true },
    estado: { type: String, required: true },
    telefono: { type: Number, required: true },
    direccion: { type: String, required: true },
    colonia: { type: String, required: true },
    cp: { type: Number, required: true },
    num_ext: { type: Number, required: true },
    num_int: { type: Number, required: false },
    productos: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ProductoProveedor', default: [] }],
    activo: { type: Number, default: 1 }
});
exports.Proveedor = mongoose_1.default.model('Proveedor', proveedorSchema);
