import mongoose, { Schema, Document } from 'mongoose';
import { IProveedor } from './proveedor.model';
import { IAlmacen } from './almacen.model';

export interface IProductoProveedor extends Document {
    nombre: string;
    costo: number;
    proveedor: IProveedor['_id'];
    detalles: string;
    existencias: number;
    almacen: IAlmacen['_id'];
    activo: number;
}
const productoProveedorSchema = new Schema({
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    detalles: { type: String, required: true },
    existencias: { type: Number, default: 0, required: true },
    almacen: { type: Schema.Types.ObjectId, ref: 'Almacen' },
    activo: { type: Number, default: 1 }
});
export const ProductoProveedor = mongoose.model<IProductoProveedor>('ProductoProveedor', productoProveedorSchema);