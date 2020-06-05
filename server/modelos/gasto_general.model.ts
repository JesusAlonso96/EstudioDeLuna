import mongoose, { Document, Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { ITipoGastoGeneral } from './tipo_gasto_general.model';
import { ISucursal } from './sucursal.model';


mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface IGastoGeneral extends Document {
    id: number;
    tipoGastoGeneral: ITipoGastoGeneral['_id'];
    metodoPago: string;
    nombre: String;
    razonSocial: string;
    rfc: String;
    subtotal: number;
    ieps: number;
    porcentajeIva: Number;
    iva: number;
    total: number;
    observaciones: String;
    sucursal: ISucursal['_id'];
    fecha: Date;
    activo: number;
}
const gastoGeneralSchema = new Schema({
    id: { type: Number, required: false },
    tipoGastoGeneral: { type: Schema.Types.ObjectId, ref: 'TipoGastoGeneral' },
    metodoPago: { type: String, required: false },
    nombre: { type: String, required: true },
    razonSocial: { type: String, required: false },
    rfc: { type: String, required: false },
    subtotal: { type: Number, required: true },
    ieps: { type: Number, required: false },
    porcentajeIva: { type: Number, required: false },
    iva: { type: Number, required: true },
    total: { type: Number, required: true },
    observaciones: { type: String, required: false },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    fecha: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Number, default: 1 }
});

gastoGeneralSchema.plugin(autoIncrement.plugin, { model: 'GastoGeneral', field: 'id' });

export const GastoGeneral = mongoose.model<IGastoGeneral>('GastoGeneral', gastoGeneralSchema);