import mongoose, { Schema, Document } from 'mongoose';
import { IUsuario } from './usuario.model';
import { ISucursal } from './sucursal.model';
import autoIncrement from 'mongoose-auto-increment';
import { environment } from '../global/environment';

mongoose.set('useUnifiedTopology', true);
var conexion = mongoose.createConnection(environment.DB_URL, { useNewUrlParser: true });
autoIncrement.initialize(conexion);
export interface ICaja extends Document {
    id: number;
    cantidadTotal: number;
    cantidadEfectivo: number;
    cantidadTarjetas: number;
    historialEgresosIngresos: [
        {
            id: number;
            fecha: Date;
            usuario: IUsuario['_id'];
            tipo: string;
            descripcion: string;
            cantidadSalida: number;
            cantidadEntrada: number;
            sucursal: ISucursal['_id'];
        }
    ];
    sucursal: ISucursal['_id'];
    ocupada: boolean;
    fechaRegistro: Date;
    activa: boolean;
}
 
const cajaSchema = new Schema({
    id: { type: Number, required: false },
    cantidadTotal: { type: Number, required: true, default: 0 },
    cantidadEfectivo: { type: Number, required: true, default: 0 },
    cantidadTarjetas: { type: Number, required: true, default: 0 },
    historialEgresosIngresos: {
        type: [ 
            {
                id: { type: Number, required: false },
                fecha: { type: Date, required: false, default: new Date(Date.now()) },
                usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
                tipo: { type: String, required: true },
                descripcion: { type: String, required: true },
                cantidadSalida: { type: Number, required: false },
                cantidadEntrada: { type: Number, required: false },
                sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' }
            }
        ], default: []
    },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' },
    ocupada: { type: Boolean, required: false, default: false },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activa: { type: Boolean, required: false, default: true }
});

cajaSchema.plugin(autoIncrement.plugin, { model: 'Caja', field: 'id' });

export const Caja = mongoose.model<ICaja>('Caja', cajaSchema);