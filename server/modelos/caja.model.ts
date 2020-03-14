import mongoose, { Schema, Document } from 'mongoose';


export interface ICaja extends Document {
    cantidadTotal: number;
    cantidadEfectivo: number;
    cantidadTarjetas: number;
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
                sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' }
            }
        ]
    }
});

export const Caja = mongoose.model<ICaja>('Caja', CajaSchema);