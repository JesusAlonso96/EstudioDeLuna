import mongoose, { Document, Schema } from 'mongoose';


export interface ISucursal extends Document {
    nombre: string;
    direccion: {
        calle: string;
        colonia: string;
        num_ext: string;
        num_int: string;
        cp: number;
        ciudad: string;
        estado: string;
    };
    telefonos: [
        {
            tipo: number;
            lada: string;
            numero: string;
            fechaRegistro: Date;
            activo: boolean;
        }
    ];
    fechaRegistro: boolean;
    activa: boolean;
    
}

const sucursalSchema = new Schema({
    nombre: { type: String, required: true },
    direccion: {
        type: {
            calle: { type: String, required: true },
            colonia: { type: String, required: true },
            num_ext: { type: String, required: true },
            num_int: { type: String, required: false },
            cp: { type: Number, required: true },
            ciudad: { type: String, required: true },
            estado: { type: String, required: true }
        }
    },
    telefonos: {
        type: [
            {
                tipo: { type: Number, required: true },
                lada: { type: String, required: true },
                numero: { type: String, required: true },
                fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
                activo: { type: Boolean, required: false, default: true },
            }
        ], required: false
    },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activa: { type: Boolean, required: true, default: true },
});

export const Sucursal = mongoose.model<ISucursal>('Sucursal', sucursalSchema);