import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProductoProveedor } from './producto_proveedor.model';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { ISucursal } from './sucursal.model';
import { IUsuario } from './usuario.model';
import { ITraspaso } from './traspaso';
import { IInventario } from './inventario.model';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);
export interface IAlmacen extends Document {
    id: number;
    nombre: string;
    direccion: {
        calle: string;
        colonia: string;
        num_ext: number;
        num_int: number;
        cp: number;
        ciudad: string;
        estado: string;
    }
    insumos: [
        {
            insumo: IProductoProveedor;
            existencia: number;
        }
    ];
    historialMov: [
        {
            fecha: Date;
            numFactura: Number;
            traspaso: ITraspaso['_id'];
            inventario: IInventario['_id'];
            insumo: IProductoProveedor['_id'];
            usuario: IUsuario['_id'];
            tipo: String;
            cantidadMovimiento: Number;
            existenciaActual: Number;
            observaciones: String;
        }
    ];
    sucursal: ISucursal['_id'];
    fechaRegistro: Date;
    activo: boolean;
}

const almacenSchema = new Schema({
    id: { type: Number, required: false },
    nombre: { type: String, required: true },
    direccion: {
        type: {
            calle: { type: String, required: true },
            colonia: { type: String, required: true },
            num_ext: { type: Number, required: true },
            num_int: { type: Number, required: false },
            cp: { type: Number, required: true },
            ciudad: { type: String, required: true },
            estado: { type: String, required: true }
        }
    },
    insumos: {
        type: [
            {
                insumo: { type: Schema.Types.ObjectId, ref: 'ProductoProveedor' },
                existencia: { type: Number }
            }
        ]
    },
    historialMov: {
        type: [
            {
                fecha: { type: Date, required: false, default: new Date(Date.now()) },
                numFactura: { type: Number, required: false },
                traspaso: { type: Schema.Types.ObjectId, ref: 'Traspaso', required: false },
                inventario: { type: Schema.Types.ObjectId, ref: 'Inventario', required: false },
                insumo: { type: Schema.Types.ObjectId, ref: 'ProductoProveedor', required: true },
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
                tipo: { type: String, required: true },
                cantidadMovimiento: {type: Number, required: true},
                existenciaActual: {type: Number, required: true},
                observaciones: { type: String, required: false },
            }
        ]
    },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Boolean, required: true, default: true }
});

almacenSchema.plugin(autoIncrement.plugin, { model: 'Almacen', field: 'id' });

export const Almacen = mongoose.model<IAlmacen>('Almacen', almacenSchema);