import mongoose, { Schema, Document, Types } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IUsuario } from './usuario.model';
import { IEmpresaCot } from './empresa_cot.model';
import { IProducto } from './producto.model';
import { ISucursal } from './sucursal.model';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);
interface ProductoCot extends Document {
    producto: IProducto['_id'];
    precioUnitario: number;
    cantidad: number;
}
export interface ICotizacion extends Document {
    num_cotizacion: number;
    fecha: Date;
    vigencia: number;
    asesor: IUsuario['_id'];
    empresa: IEmpresaCot['_id'];
    productos: Types.Array<ProductoCot>;
    subtotal: number;
    total: number;
    iva: number;
    forma_pago: string;
    fecha_entrega: Date;
    fecha_evento: Date;
    sucursal: ISucursal['_id'];
}
const cotizacionSchema = new Schema({
    num_cotizacion: { type: Number },
    fechaRegistro: { type: Date, required: true, default: new Date(Date.now()) },
    vigencia: { type: Number, required: true },
    asesor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    empresa: { type: Schema.Types.ObjectId, ref: 'Empresa_cot' },
    productos: [{
        producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
        precioUnitario: { type: Number, required: true },
        cantidad: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    iva: { type: Number, required: true },
    forma_pago: { type: String, required: false },
    fecha_entrega: { type: Date, required: true },
    fecha_evento: { type: Date, required: false },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal', required: true },

},
    {
        collection: 'cotizaciones'
    });
cotizacionSchema.plugin(autoIncrement.plugin, { model: 'Cotizacion', field: 'num_cotizacion' })
export const Cotizacion = mongoose.model<ICotizacion>('Cotizacion', cotizacionSchema);