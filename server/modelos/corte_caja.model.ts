import mongoose, { Schema, Document } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';
import { IUsuario } from './usuario.model';
import { ISucursal } from './sucursal.model';
import { ICaja } from './caja.model';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);

export interface ICorteCaja extends Document {
    num_corte: number;
    fecha: Date;
    hora: string;
    usuario: IUsuario['_id'];
    efectivoEsperado: number;
    tarjetaEsperado: number;
    efectivoContado: number;
    tarjetaContado: number;
    fondoEfectivo: number;
    fondoTarjetas: number;
    sucursal: ISucursal['_id'];
    caja: ICaja['_id'];
}
const CorteCajaSchema = new Schema({
    num_corte: { type: Number },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    usuario: { type: mongoose.Types.ObjectId, ref: 'Usuario' },
    efectivoEsperado: { type: Number, required: true },
    tarjetaEsperado: { type: Number, required: true },
    efectivoContado: { type: Number, required: true },
    tarjetaContado: { type: Number, required: true },
    fondoEfectivo: { type: Number, required: true },
    fondoTarjetas: { type: Number, required: true },
    sucursal: { type: mongoose.Types.ObjectId, ref: 'Sucursal' },
    caja: { type: mongoose.Types.ObjectId, ref: 'Caja' }
});
CorteCajaSchema.plugin(autoIncrement.plugin, { model: 'Corte_caja', field: 'num_corte' });
export const CorteCaja = mongoose.model<ICorteCaja>('CorteCaja', CorteCajaSchema);