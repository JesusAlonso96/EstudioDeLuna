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
const ventaSchema = new mongoose_1.Schema({
    pedido: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Pedido' },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    vendedor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' }
});
exports.Venta = mongoose_1.default.model('Venta', ventaSchema);
