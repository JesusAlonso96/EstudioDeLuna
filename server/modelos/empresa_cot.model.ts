import mongoose, { Schema, Document } from 'mongoose';


export interface IEmpresaCot extends Document {
    nombre: string;
    direccion: string;
    contacto: string;
    telefono: string;
    email: string;
    activa: number;
}
const empresa_cotSchema = new Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    contacto: { type: String, required: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    activa: { type: Number, required: true, default: 1 }
});
export const EmpresaCot = mongoose.model<IEmpresaCot>('Empresa_cot', empresa_cotSchema);