import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProductoProveedor } from './producto_proveedor.model';
import { ISucursal } from './sucursal.model';

export interface IProveedor extends Document {
    nombre: string;
    rfc: string;
    email: string;
    ciudad: string;
    estado: string;
    telefono: number;
    direccion: string;
    colonia: string;
    cp: number;
    num_ext: number;
    num_int: number;
    productos: Types.Array<IProductoProveedor>;
    sucursal: ISucursal['_id'];
    activo: number;
}
const proveedorSchema = new Schema({
    nombre: { type: String, required: true },
    rfc: { type: String, required: true },
    email: { type: String, required: true },
    ciudad: { type: String, required: true },
    estado: { type: String, required: true },
    telefono: { type: Number, required: true },
    direccion: { type: String, required: true },
    colonia: { type: String, required: true },
    cp: { type: Number, required: true },
    num_ext: { type: Number, required: true },
    num_int: { type: Number, required: false },
    productos: [{ type: Schema.Types.ObjectId, ref: 'ProductoProveedor', default: [] }],
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal'},
    activo: { type: Number, default: 1 }

});
export const Proveedor = mongoose.model<IProveedor>('Proveedor', proveedorSchema);