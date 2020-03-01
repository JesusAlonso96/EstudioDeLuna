import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProductoProveedor } from './producto_proveedor.model';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';

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
    insumos: Types.Array<IProductoProveedor>;
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
    insumos: [{ type: Schema.Types.ObjectId, ref: 'ProductoProveedor' }],
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Boolean, required: true, default: true }
});

almacenSchema.plugin(autoIncrement.plugin, { model: 'Almacen', field: 'id' });

export const Almacen = mongoose.model<IAlmacen>('Almacen', almacenSchema);