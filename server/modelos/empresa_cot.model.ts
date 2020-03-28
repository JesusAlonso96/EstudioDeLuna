import mongoose, { Schema, Document } from 'mongoose';
import { ISucursal } from './sucursal.model';


export interface IEmpresaCot extends Document {
    nombre: string;
    direccion: string;
    contacto: string;
    telefono: string;
    email: string;
    sucursal: ISucursal['_id'];
    activa: number;
}
const empresa_cotSchema = new Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    contacto: { type: String, required: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    sucursal: { type: mongoose.Types.ObjectId, ref: 'Sucursal' },
    activa: { type: Number, required: true, default: 1 }
},
{
    collection:'empresas'
});
export const EmpresaCot = mongoose.model<IEmpresaCot>('Empresa_cot', empresa_cotSchema);