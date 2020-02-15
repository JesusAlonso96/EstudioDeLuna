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
const familiaSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    productos: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Producto' }],
    activa: { type: Number, default: 1 }
});
exports.Familia = mongoose_1.default.model('familia', familiaSchema);
