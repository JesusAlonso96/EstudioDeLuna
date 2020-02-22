import mongoose, { Schema, Document, Types } from 'mongoose';
import { IFamilia } from './familia.model';


export interface IProducto extends Document {
    nombre: string;
    familia: IFamilia['_id'];
    num_fotos: number;
    precio: number;
    descripcion: string;
    b_n: boolean;
    c_r: boolean;
    c_ad: boolean;
    caracteristicas: Types.Array<string>;
    ancho: number;
    alto: number;
    activo: number;
}

const productoSchema = new Schema({
    nombre: { type: String, required: true },
    familia: { type: Schema.Types.ObjectId, ref: 'Familia' },
    num_fotos: { type: Number, required: false },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: false },
    b_n: { type: Boolean },
    c_r: { type: Boolean },
    c_ad: { type: Boolean },
    caracteristicas: [{ type: String }],
    ancho: { type: Number },
    alto: { type: Number },
    activo: { type: Number }
});

export const Producto = mongoose.model<IProducto>('Producto', productoSchema);