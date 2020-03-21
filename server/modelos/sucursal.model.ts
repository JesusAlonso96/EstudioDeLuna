import mongoose, { Document, Schema } from 'mongoose';


export interface ISucursal extends Document {
    nombre: string;
    direccion: {
        calle: string;
        colonia: string;
        num_ext: number;
        num_int: number;
        cp: number;
        ciudad: string;
        estado: string;
    }
    activa: boolean;
    
}

const sucursalSchema = new Schema({
    nombre: { type: String, required: true },
    direccion: {
        type: {
            calle: { type: String, required: true },
            colonia: { type: String, required: true },
            num_ext: { type: Number, required: true },
            num_int: { type: Number, required: false },
            cp: { type: Number, required: true },
            ciudad: { type: String, required: true },
            estado: { type: String, required: true }
        }
    },
    activa: { type: Boolean, required: true, default: true },
});

export const Sucursal = mongoose.model<ISucursal>('Sucursal', sucursalSchema);