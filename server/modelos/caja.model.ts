import mongoose, { Schema, Document } from 'mongoose';
import { IUsuario } from './usuario.model';
import { ISucursal } from './sucursal.model';


export interface ICaja extends Document {
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
    ]
}

const CajaSchema = new Schema({
    cantidadTotal: { type: Number, required: true },
    cantidadEfectivo: { type: Number, required: true },
    cantidadTarjetas: { type: Number, required: true },
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
        ]
    }
});

export const Caja = mongoose.model<ICaja>('Caja', CajaSchema);