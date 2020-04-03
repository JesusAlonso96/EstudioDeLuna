import mongoose, { Schema, Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import express from 'express';
import { IAsistencia } from './asistencia.model';
import { IPedido } from './pedido.model';
import { ISucursal } from './sucursal.model';

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
    sucursal: ISucursal['_id'];
    configuracion: {
        notificaciones: {
            botonCerrar: boolean,
            tiempo: number,
            posicion: string,
            barraProgreso: boolean;
        },
        tema: string;
    };
    logo: string;
    fotoPerfil: string;
    codigoRecuperacion: string;
    activo: number;
}
const usuarioSchema = new Schema({
    nombre: { type: String, required: false },
    username: { type: String, required: false },
    ape_pat: { type: String, required: false },
    ape_mat: { type: String, required: false },
    email: { type: String, required: false },
    telefono: { type: Number, required: false },
    contrasena: { type: String, required: false },
    rol: { type: Number, required: false },
    rol_sec: { type: Number, required: false },
    ocupado: { type: Boolean, required: false, default: false },
    asistencia: [{ type: Schema.Types.ObjectId, ref: 'Asistencia', default: [] }],
    pedidosTomados: [{ type: Schema.Types.ObjectId, ref: 'Pedido', default: [] }],
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    configuracion: {
        type: {
            notificaciones: {
                type: {
                    botonCerrar: { type: Boolean, default: true },
                    tiempo: { type: Number, default: 2000 },
                    posicion: { type: String, default: 'toast-top-right' },
                    barraProgreso: { type: Boolean, default: false }
                }
            },
            tema: { type: String, required: false }
        }
    },
    logo: {type: String, required: false},
    fotoPerfil: {type: String, required:false},
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