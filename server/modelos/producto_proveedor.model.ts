import mongoose, { Document, Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IAlmacen } from './almacen.model';
import { IProveedor } from './proveedor.model';


mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface IProductoProveedor extends Document {
    id: number;
    nombre: string;
    costo: number;
    proveedor: IProveedor['_id'];
    detalles: string;
    existencias: number;
    almacen: IAlmacen['_id'];
    activo: number;
}
const productoProveedorSchema = new Schema({
    id: { type: Number, required: false },
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    detalles: { type: String, required: true },
    existencias: { type: Number, default: 0, required: true },
    almacen: { type: Schema.Types.ObjectId, ref: 'Almacen' },
    historialMov: {
        type: [
            {
                fecha: { type: Date, required: false },
                numFactura: { type: Number, required: false },
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
                tipo: { type: String, required: true }
            }
        ]
    },
    //traspasos
    activo: { type: Number, default: 1 }
});

productoProveedorSchema.plugin(autoIncrement.plugin, { model: 'ProductoProveedor', field: 'id' });

export const ProductoProveedor = mongoose.model<IProductoProveedor>('ProductoProveedor', productoProveedorSchema);