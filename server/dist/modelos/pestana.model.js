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
const pestanaSchema = new mongoose_1.Schema({
    rol: { type: String, required: true },
    nombre: { type: String, required: true },
    ruta: { type: String, required: true },
    icono: { type: String, required: true },
});
exports.Pestana = mongoose_1.default.model('Pestana', pestanaSchema);
