import mongoose, { Schema, Document, Types } from 'mongoose';
import { IProductoProveedor } from './producto_proveedor.model';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IUsuario } from './usuario.model';
import { IAlmacen } from './almacen.model';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);
export interface ITraspaso extends Document {
    id: number;
    almacenOrigen: IAlmacen['_id'];
    almacenDestino: IAlmacen['_id'];
    insumo: IProductoProveedor['_id'];
    usuario: IUsuario['_id'];
    estado: String;
    cantidadMovimiento: Number;
    observaciones: String;
    fechaRegistro: Date;
    activo: boolean;
}

const traspasoSchema = new Schema({
    id: { type: Number, required: false },
    almacenOrigen: { type: Schema.Types.ObjectId, ref: 'Almacen', required: false },
    almacenDestino: { type: Schema.Types.ObjectId, ref: 'Almacen', required: false },
    insumo: { type: Schema.Types.ObjectId, ref: 'ProductoProveedor', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    estado: { type: String, required: true },
    cantidadMovimiento: {type: Number, required: true},
    observaciones: { type: String, required: false },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Boolean, required: true, default: true }
});

traspasoSchema.plugin(autoIncrement.plugin, { model: 'Traspaso', field: 'id' });

export const Traspaso = mongoose.model<ITraspaso>('Traspaso', traspasoSchema);