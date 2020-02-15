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
const empresa_cotSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    contacto: { type: String, required: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    activa: { type: Number, required: true, default: 1 }
});
exports.EmpresaCot = mongoose_1.default.model('Empresa_cot', empresa_cotSchema);
