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
const productoSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    familia: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Familia' },
    num_fotos: { type: Number, required: false },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: false },
    b_n: { type: Boolean },
    c_r: { type: Boolean },
    c_ad: { type: Boolean },
    caracteristicas: [{ type: String }],
    ancho: { type: Number },
    alto: { type: Number },
    activo: { type: Number }
});
exports.Producto = mongoose_1.default.model('Producto', productoSchema);
