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
const clienteSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    username: { type: String, required: false },
    ape_pat: { type: String, required: true },
    ape_mat: { type: String, required: true },
    email: { type: String, required: false },
    telefono: { type: Number, required: false },
    contrasena: { type: String, required: true },
    razonSocial: { type: String, required: false },
    rfc: { type: String, required: false },
    direccion: { type: String, required: true },
    colonia: { type: String, required: true },
    municipio: { type: String, required: true },
    estado: { type: String, required: true },
    cp: { type: Number, required: true },
    num_ext: { type: Number, required: true },
    num_int: { type: Number, required: false },
    pedidos: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Pedido' }],
    fecha_registro: { type: Date, required: true },
    activo: { type: Number, default: 1 }
});
exports.Cliente = mongoose_1.default.model('Cliente', clienteSchema);
