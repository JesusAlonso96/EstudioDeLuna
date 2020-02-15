import mongoose, { Schema, Document, Types } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IUsuario } from './usuario.model';
import { ICliente } from './cliente.model';
import { IProducto } from './producto.model';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface IPedido extends Document {
    num_pedido: number;
    fotografo: IUsuario['_id'];
    cliente: ICliente['_id'];
    fecha_creacion: Date,
    fecha_entrega: Date,
    comentarios: string;
    productos: Types.Array<IProducto>;
    status: string;
    total: number;
    c_retoque: boolean;
    c_adherible: boolean;
    importante: boolean;
    anticipo: number;
    foto: string;
    metodoPago: string;
}
const pedidoSchema = new Schema({
    num_pedido: { type: Number },//
    fotografo: { type: Schema.Types.ObjectId, ref: 'Usuario' },//
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },//
    fecha_creacion: { type: Date, required: true },//
    fecha_entrega: { type: Date },//
    comentarios: { type: String },//
    productos: [{ type: Schema.Types.ObjectId, ref: 'Producto' }],//
    status: { type: String },
    total: { type: Number },//
    c_retoque: { type: Boolean },//
    c_adherible: { type: Boolean },//
    importante: { type: Boolean },//
    anticipo: { type: Number },//
    foto: { type: String },
    metodoPago: { type: String }
});

pedidoSchema.plugin(autoIncrement.plugin, { model: 'Pedido', field: 'num_pedido' });

export const Pedido = mongoose.model<IPedido>('Pedido', pedidoSchema);