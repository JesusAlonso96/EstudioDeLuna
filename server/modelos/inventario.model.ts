import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProductoProveedor } from './producto_proveedor.model';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IAlmacen } from "./almacen.model";
import { IUsuario } from './usuario.model';
import { ISucursal } from './sucursal.model';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface IInventario extends Document {
    id: number;
    insumos: [
        {
            insumo: IProductoProveedor;
            existenciaEsperada: number;
            existenciaReal: number;
            revisado: boolean;
            observaciones: string;
        }
    ]
    sucursal: ISucursal['_id'];
    usuario: IUsuario['_id'];
    almacen: IAlmacen['_id'];
    fechaRegistro: Date;
    activo: boolean;
}

const inventarioSchema = new Schema({
    id: { type: Number, required: false },
    insumos: {
        type: [
            {
                insumo: { type: Schema.Types.ObjectId, ref: 'ProductoProveedor' },
                existenciaEsperada: { type: Number, required: true },
                existenciaReal: { type: Number, required: true },
                revisado: { type: Boolean, required: true },
                observaciones: { type: String, required: false }
            }
        ]
    },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    almacen: { type: Schema.Types.ObjectId, ref: 'Almacen' },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Boolean, required: true, default: true }
});

inventarioSchema.plugin(autoIncrement.plugin, { model: 'Inventario', field: 'id' });

export const Inventario = mongoose.model<IInventario>('Inventario', inventarioSchema);
