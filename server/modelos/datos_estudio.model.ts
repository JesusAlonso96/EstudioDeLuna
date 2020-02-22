import mongoose, { Schema, Document } from 'mongoose';


export interface IDatosEstudio extends Document {
    nombre: string;
    telefono: string;
    direccion: string;
}

const datos_estudioSchema = new Schema({
    nombre: { type: String, required: true },
    telefono: { type: Number, required: true },
    direccion: {type: String, required:true}
});

export const DatosEstudio = mongoose.model<IDatosEstudio>('Datos_estudio', datos_estudioSchema);