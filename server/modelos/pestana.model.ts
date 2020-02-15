import mongoose, { Schema, Document } from 'mongoose';


export interface IPestana extends Document {
    rol: string;
    nombre: string;
    ruta: string;
    icono: string;
}

const pestanaSchema = new Schema({
    rol: { type: String, required: true },
    nombre: { type: String, required: true },
    ruta: { type: String, required: true },
    icono: { type: String, required: true },

});

export const Pestana = mongoose.model<IPestana>('Pestana', pestanaSchema);
