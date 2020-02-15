import mongoose, {Schema, Document, Types} from 'mongoose';
import { IProductoProveedor } from './producto_proveedor.model';

export interface IAlmacen extends Document{
    productos: Types.Array<IProductoProveedor>;
}

const almacenSchema = new Schema({
    productos: [{ type: Schema.Types.ObjectId, ref: 'ProductoProveedor' }]
});


export const Almacen = mongoose.model<IAlmacen>('Almacen', almacenSchema);