import mongoose, { Schema, Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import express from 'express';
import { IAsistencia } from './asistencia.model';
import { IPedido } from './pedido.model';

export interface IUsuario extends Document {
    nombre: string;
    username: string;
    ape_pat: string;
    ape_mat: string;
    email: string;
    telefono: number;
    contrasena: string;
    rol: number;
    rol_sec: number;
    ocupado: boolean;
    asistencia: Types.Array<IAsistencia>;
    pedidosTomados: Types.Array<IPedido>;
    codigoRecuperacion: string;
    activo: number;
}
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
    codigoRecuperacion: { type: String, required: false, default: '' },
    activo: { type: Number, default: 1 }
});
//funcion para verificar la contrasena encriptada
usuarioSchema.methods.verificarContrasena = function (contrasena: string) {
    return bcrypt.compareSync(contrasena, this.contrasena);
}
//funcion para encriptar contrasena
usuarioSchema.pre<IUsuario>('save', function (next: express.NextFunction) {
    var usuario = this;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(usuario.contrasena, salt, function (err, hash) {
            usuario.contrasena = hash;
            next();
        })
    })
})
export const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);