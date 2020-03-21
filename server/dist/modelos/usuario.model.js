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
const bcrypt = __importStar(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    username: { type: String, required: true },
    ape_pat: { type: String, required: true },
    ape_mat: { type: String, required: true },
    email: { type: String, required: false },
    telefono: { type: Number, required: false },
    contrasena: { type: String, required: true },
    rol: { type: Number, required: true },
    rol_sec: { type: Number, required: false },
    ocupado: { type: Boolean, required: false, default: false },
    asistencia: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Asistencia', default: [] }],
    pedidosTomados: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Pedido', default: [] }],
    sucursal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sucursal' },
    codigoRecuperacion: { type: String, required: false, default: '' },
    activo: { type: Number, default: 1 }
});
//funcion para verificar la contrasena encriptada
usuarioSchema.methods.verificarContrasena = function (contrasena) {
    return bcrypt.compareSync(contrasena, this.contrasena);
};
//funcion para encriptar contrasena
usuarioSchema.pre('save', function (next) {
    var usuario = this;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(usuario.contrasena, salt, function (err, hash) {
            usuario.contrasena = hash;
            next();
        });
    });
});
exports.Usuario = mongoose_1.default.model('Usuario', usuarioSchema);
