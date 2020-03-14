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
const CajaSchema = new mongoose_1.Schema({
    cantidadTotal: { type: Number, required: true },
    cantidadEfectivo: { type: Number, required: true },
    cantidadTarjetas: { type: Number, required: true },
    historialEgresosIngresos: {
        type: [
            {
                id: { type: Number, required: false },
                fecha: { type: Date, required: false, default: new Date(Date.now()) },
                usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' },
                tipo: { type: String, required: true },
                descripcion: { type: String, required: true },
                sucursal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sucursal' }
            }
        ]
    }
});
exports.Caja = mongoose_1.default.model('Caja', CajaSchema);
