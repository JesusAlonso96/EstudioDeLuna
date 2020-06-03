import mongoose, { Schema, Document } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { ISucursal } from './sucursal.model';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface ITipoGastoGeneral extends Document {
    id: number;
    nombre: string;
    descripcion: string;
    tipoDePersona: number
    nombre_persona: string;
    ape_pat_persona: string;
    ape_mat_persona: string;
    razonSocial: string;
    rfc: string;
    sucursal: ISucursal['_id'];
    fechaRegistro: Date;
    activo: number;
}

const tipoGastoGeneralSchema = new Schema({
    id: { type: Number, required: false },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: false },
    tipoDePersona: { type: Number, required: false },
    nombre_persona: { type: String, required: false },
    ape_pat_persona: { type: String, required: false },
    ape_mat_persona: { type: String, required: false },
    razonSocial: { type: String, required: false },
    rfc: { type: String, required: false },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Number, default: 1 }
});

tipoGastoGeneralSchema.plugin(autoIncrement.plugin, { model: 'TipoGastoGeneral', field: 'id' });

export const TipoGastoGeneral = mongoose.model<ITipoGastoGeneral>('TipoGastoGeneral', tipoGastoGeneralSchema);