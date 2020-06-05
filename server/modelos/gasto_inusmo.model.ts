import mongoose, { Document, Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { ICompra } from './compra.model';
import { ISucursal } from './sucursal.model';


mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface IGastoInsumo extends Document {
    id: number;
    compra: ICompra['_id'];
    razonSocial: string;
    rfc: String;
    observaciones: String;
    sucursal: ISucursal['_id'];
    fecha: Date;
    activo: number;
}
const gastoInsumoSchema = new Schema({
    id: { type: Number, required: false },
    compra: { type: Schema.Types.ObjectId, ref: 'Compra' },
    razonSocial: { type: String, required: false },
    rfc: { type: String, required: false },
    observaciones: { type: String, required: false },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    fecha: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Number, default: 1 }
});

gastoInsumoSchema.plugin(autoIncrement.plugin, { model: 'GastoInsumo', field: 'id' });

export const GastoInsumo = mongoose.model<IGastoInsumo>('GastoInsumo', gastoInsumoSchema);