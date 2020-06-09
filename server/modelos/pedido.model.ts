import mongoose, { Schema, Document, Types } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IUsuario } from './usuario.model';
import { ICliente } from './cliente.model';
import { IProducto } from './producto.model';
import { ISucursal } from './sucursal.model';

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
    productos: [
        {
            producto: IProducto['_id'];
            precioUnitario: number;
            cantidad: number;
        }
    ]
    status: string;
    total: number;
    c_retoque: boolean;
    c_adherible: boolean;
    importante: boolean;
    anticipo: number;
    foto: string;
    metodoPago: string;
    sucursal: ISucursal['_id'];
    usuario: IUsuario['_id'];
    fecha_realizacion: Date;
    fecha_entrega_real: Date;
}
const pedidoSchema = new Schema({
    num_pedido: { type: Number },//
    fotografo: { type: Schema.Types.ObjectId, ref: 'Usuario' },//
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },//
    fecha_creacion: { type: Date, required: true },//
    fecha_entrega: { type: Date },//
    comentarios: { type: String },//
    productos: {
        type: [
            {
                producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
                precioUnitario: { type: Number, required: true },
                cantidad:  { type: Number, required: true },
            }
        ]
    },//
    status: { type: String },
    total: { type: Number },//
    c_retoque: { type: Boolean },//
    c_adherible: { type: Boolean },//
    importante: { type: Boolean },//
    anticipo: { type: Number },//
    foto: { type: String },
    metodoPago: { type: String },
    sucursal: [{ type: Schema.Types.ObjectId, ref: 'Sucursal' }],//
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fecha_realizacion: { type: Date },
    fecha_entrega_real: { type: Date }
});

pedidoSchema.plugin(autoIncrement.plugin, { model: 'Pedido', field: 'num_pedido' });

export const Pedido = mongoose.model<IPedido>('Pedido', pedidoSchema);