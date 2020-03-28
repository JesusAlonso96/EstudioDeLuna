import mongoose, { Schema, Document, Types } from 'mongoose';
import { IPedido } from './pedido.model';
import { IUsuario } from './usuario.model';
import { ISucursal } from './sucursal.model';


export interface IVenta extends Document {
    pedido: IPedido['_id'];
    fecha: Date;
    hora: string;
    vendedor: IUsuario['_id'];
    sucursal: ISucursal['_id'];
}

const ventaSchema = new Schema({
    pedido: { type: Schema.Types.ObjectId, ref:'Pedido' },
    fecha: {type: Date, required:true},
    hora: {type: String, required:true},
    vendedor: { type: Schema.Types.ObjectId, ref:'Usuario' },
    sucursal: { type: Schema.Types.ObjectId, ref:'Sucursal' }
});

export const Venta = mongoose.model<IVenta>('Venta', ventaSchema);