import mongoose, { Schema, Document } from 'mongoose';
import { IUsuario } from './usuario.model';
import { IProveedor } from './proveedor.model';
import { IAlmacen } from './almacen.model';
import { IProductoProveedor } from './producto_proveedor.model';
import { ISucursal } from './sucursal.model';

export interface ICompra extends Document {
    id: number;
    fecha: Date;
    usuario: IUsuario['_id'];
    proveedor: IProveedor['_id'];
    almacen: IAlmacen['_id'];
    numFactura: number;
    insumosCompra: [
        {
            insumo: IProductoProveedor['_id'];
            cantidad: number;
            subtotal: number;
        }
    ];
    subtotal: number;
    iva: number;
    costoEnvio: number;
    metodoPago: string;
    total: number;
    sucursal: ISucursal['_id'];
}

const compraSchema = new Schema({
    id: { type: Number, required: false },
    fecha: { type: Date, required: false, default: new Date(Date.now()) },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    almacen: { type: Schema.Types.ObjectId, ref: 'Almancen' },
    numFactura: { type: Number, required: true },
    insumosCompra: {
        type: [
            {
                insumo: { type: Schema.Types.ObjectId, ref: 'ProductoProveedor' },
                cantidad: { type: Number, required: true },
                subtotal: { type: Number, required: true }
            }
        ], required: true
    },
    subtotal: { type: Number, required: true },
    iva: { type: Number, required: true },
    costoEnvio: { type: Number, required: true },
    metodoPago: { type: String, required: false },
    total: { type: Number, required: true },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' }
});

export const Compra = mongoose.model<ICompra>('Compra', compraSchema);