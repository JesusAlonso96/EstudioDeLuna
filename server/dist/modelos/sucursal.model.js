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
    direccion: { type: String, required: true },
    almacen: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Almacen' },
    activa: { type: Boolean, required: true, default: 1 }
});
exports.Sucursal = mongoose_1.default.model('Sucursal', sucursalSchema);
