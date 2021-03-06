import mongoose, { Document, Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IAlmacen } from './almacen.model';
import { IProveedor } from './proveedor.model';
import { IUsuario } from './usuario.model';


mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface IProductoProveedor extends Document {
    id: number;
    codigoBarras: string;
    nombre: string;
    costo: number;
    proveedor: IProveedor['_id'];
    detalles: string;
    almacen: IAlmacen['_id'];
    historialMov: [
        {
            fecha: Date;
            numFactura: Number;
            usuario: IUsuario['_id'];
            tipo: String;
            cantidadMovimiento: Number;
        }
    ];
    activo: number;
}
const productoProveedorSchema = new Schema({
    id: { type: Number, required: false },
    codigoBarras: { type: String, required: true },
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    detalles: { type: String, required: true },
    existencias: { type: Number, default: 0, required: true },
    almacen: { type: Schema.Types.ObjectId, ref: 'Almacen' },
    historialMov: {
        type: [
            {
                fecha: { type: Date, required: false, default: new Date(Date.now()) },
                numFactura: { type: Number, required: false },
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
                tipo: { type: String, required: true },
                cantidadMovimiento: {type: Number, required:false}
            }
        ]
    },
    //traspasos
    activo: { type: Number, default: 1 }
});

productoProveedorSchema.plugin(autoIncrement.plugin, { model: 'ProductoProveedor', field: 'id' });

export const ProductoProveedor = mongoose.model<IProductoProveedor>('ProductoProveedor', productoProveedorSchema);