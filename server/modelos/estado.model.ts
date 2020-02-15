import mongoose, { Schema, Document } from 'mongoose';
 

export interface IEstado extends Document{
    nombre: string;
}
const estadoSchema = new Schema({
    nombre: { type: String, required: true },
});
export const Estado = mongoose.model<IEstado>('Estado', estadoSchema);