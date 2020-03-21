import mongoose, { Document, Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IUsuario } from './usuario.model';
import { IProveedor } from './proveedor.model';
import { IProductoProveedor } from './producto_proveedor.model';
import { ISucursal } from './sucursal.model';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface IOrdenCompra extends Document {
    id: number;
    proveedor: IProveedor['_id'];
    fechaPedido: Date;
    fechaEntrega: Date;
    terminosEntrega: string;
    terminosPago: string;
    lugarEntrega: string;
    subtotal: number;
    iva: number;
    total: number;
    costoEnvio: number;
    productosOrdenCompra: [
        {
            insumo: IProductoProveedor['_id'];
            cantidadOrden: number
        }
    ];
    sucursal: ISucursal['_id'];
    usuario: IUsuario['_id'];
    activa: boolean;
}
const ordenCompraSchema = new Schema({
    id: { type: Number, required: false },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor', required: true },
    fechaPedido: { type: Date, required: true },
    fechaEntrega: { type: Date, required: true },
    terminosEntrega: { type: String, required: false },
    terminosPago: { type: String, required: false },
    lugarEntrega: { type: String, required: false },
    subtotal: { type: Number, required: true },
    iva: { type: Number, required: true },
    total: { type: Number, required: true },
    costoEnvio: { type: Number, required: false },
    productosOrdenCompra: {
        type: [
            {
                insumo: { type: Schema.Types.ObjectId, ref: 'ProductoProveedor', required: true },
                cantidadOrden: { type: Number, required: true }
            }
        ], required: true
    },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    activa: { type: Boolean, required: false, default: true }
});

ordenCompraSchema.plugin(autoIncrement.plugin, { model: 'OrdenCompra', field: 'id' });

export const OrdenCompra = mongoose.model<IOrdenCompra>('OrdenCompra', ordenCompraSchema);
