import mongoose, { Schema, Document } from 'mongoose';


export interface ICaja extends Document {
    cantidadTotal: number;
    cantidadEfectivo: number;
    cantidadTarjetas: number;
}

const CajaSchema = new Schema({
    cantidadTotal: { type: Number, required: true },
    cantidadEfectivo: { type: Number, required: true },
    cantidadTarjetas: { type: Number, required: true }
});

export const Caja = mongoose.model<ICaja>('Caja', CajaSchema);