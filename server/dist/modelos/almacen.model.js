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
const almacenSchema = new mongoose_1.Schema({
    productos: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ProductoProveedor' }]
});
exports.Almacen = mongoose_1.default.model('Almacen', almacenSchema);
