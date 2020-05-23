import mongoose, { Schema, Document, Types } from 'mongoose';
import { IPedido } from './pedido.model';
import { ISucursal } from './sucursal.model';


export interface ICliente extends Document {
    nombre: string;
    username: string;
    ape_pat: string;
    ape_mat: string;
    email: string;
    telefono: number;
    contrasena: string;
    razonSocial: string;
    rfc: string;
    direccion: string;
    colonia: string;
    municipio: string;
    estado: string;
    cp: number;
    num_ext: string;
    num_int: string;
    pedidos: Types.Array<IPedido>;
    sucursal: ISucursal['_id'];
    fechaRegistro: Date;
    activo: number;
}

const clienteSchema = new Schema({
    nombre: { type: String, required: true },
    username: { type: String, required: false },
    ape_pat: { type: String, required: true },
    ape_mat: { type: String, required: false },
    email: { type: String, required: false },
    telefono: { type: Number, required: false },
    contrasena: { type: String, required: true },
    razonSocial: { type: String, required: false },
    rfc: { type: String, required: false },//en caso de querer factura
    direccion: { type: String, required: true },
    colonia: { type: String, required: true },
    municipio: { type: String, required: true },
    estado: { type: String, required: true },
    cp: { type: Number, required: true },
    num_ext: { type: String, required: true },
    num_int: { type: String, required: false },
    pedidos: [{ type: Schema.Types.ObjectId, ref: 'Pedido' }],
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    fechaRegistro: { type: Date, required: true, default: new Date(Date.now()) },
    activo: { type: Number, default: 1 }

});

export const Cliente = mongoose.model<ICliente>('Cliente', clienteSchema);