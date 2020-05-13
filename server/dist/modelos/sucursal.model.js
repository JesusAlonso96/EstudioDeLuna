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
const sucursalSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    direccion: {
        type: {
            calle: { type: String, required: true },
            colonia: { type: String, required: true },
            num_ext: { type: String, required: true },
            num_int: { type: String, required: false },
            cp: { type: Number, required: true },
            ciudad: { type: String, required: true },
            estado: { type: String, required: true }
        }
    },
    telefonos: {
        type: [
            {
                tipo: { type: Number, required: true },
                lada: { type: String, required: true },
                numero: { type: String, required: true },
                fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
                activo: { type: Boolean, required: false, default: true },
            }
        ], required: false
    },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activa: { type: Boolean, required: true, default: true },
});
exports.Sucursal = mongoose_1.default.model('Sucursal', sucursalSchema);
