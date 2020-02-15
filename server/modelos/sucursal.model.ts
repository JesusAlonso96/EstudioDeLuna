import mongoose, { Schema, Document, Types } from 'mongoose';
import { IAlmacen } from './almacen.model';


export interface ISucursal extends Document {
    nombre: string;
    direccion: string;
    almacen: IAlmacen['_id'];
    activa: number;
}

const sucursalSchema = new Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    almacen: { type: Schema.Types.ObjectId, ref: 'Almacen' },
    activa: { type: Boolean, required: true, default: 1 }
});

export const Sucursal = mongoose.model<ISucursal>('Sucursal', sucursalSchema);