import mongoose, { Schema, Document } from 'mongoose';

export interface IAsistencia extends Document {
    fecha: Date;
    asistencia: boolean;
}

const asistenciaSchema = new Schema({
    fecha: { type: Date },
    asistencia: Boolean
});

export const Asistencia = mongoose.model<IAsistencia>('Asistencia', asistenciaSchema);