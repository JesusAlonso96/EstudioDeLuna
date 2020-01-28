const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

const usuarioSchema = new Schema({
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
    asistencia: [{ type: Schema.Types.ObjectId, ref: 'Asistencia', default: [] }],
    pedidosTomados: [{ type: Schema.Types.ObjectId, ref: 'Pedido', default: [] }],
    activo: { type: Number, default: 1 }
});
//funcion para verificar la contrasena encriptada
usuarioSchema.methods.verificarContrasena = function (contrasena) {
    return bcrypt.compareSync(contrasena, this.contrasena);
}
//funcion para encriptar contrasena
usuarioSchema.pre('save', function (next) {
    const usuario = this;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(usuario.contrasena, salt, function (err, hash) {
            usuario.contrasena = hash;
            next();
        })
    })
})

module.exports = mongoose.model('Usuario', usuarioSchema);