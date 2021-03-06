import mongoose, { Schema, Document } from 'mongoose';


export interface IMunicipio extends Document {
    nombre: string;
}
const municipioSchema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: Schema.Types.ObjectId, ref: 'Estado' }
});
export const Municipio = mongoose.model<IMunicipio>('Municipio', municipioSchema);
