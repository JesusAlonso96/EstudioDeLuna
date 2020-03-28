import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProducto } from './producto.model';
import { ISucursal } from './sucursal.model';

export interface IFamilia extends Document {
    nombre: string;
    productos: Types.Array<IProducto>;
    sucursal: ISucursal['_id'];
    activa: number;
}
const familiaSchema = new Schema({
    nombre: { type: String, required: true },
    productos: [{ type: mongoose.Types.ObjectId, ref: 'Producto' }],
    sucursal: { type: mongoose.Types.ObjectId, ref: 'Sucursal' },
    activa: { type: Number, default: 1 }
});
export const Familia = mongoose.model<IFamilia>('familia', familiaSchema);