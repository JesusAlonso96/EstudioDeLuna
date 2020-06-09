import mongoose, { Document, Schema } from 'mongoose';

export interface IDatosEmpresa extends Document {
    nombre: string;
    rutaLogo: string;
    horarioTrabajo: string;
    curp: string //no
    nombreContacto: string;//si
    correoContacto: string//si
    nombreContactoFacturacion: string;//no
    correoContactoFacturacion: string//no
    telefonoContactoFacturacion: {
        lada: string;
        numero: string;
    };
    telefonos: {
        lada: string;
        numero: string;
    }[];
    direccion: {
        calle: string;
        num_ext: string;
        num_int: string;
        colonia: string;
        estado: string;
        ciudad: string;
        cp: string;
    };
    direccionFacturacion: {
        calle: string;
        num_ext: string;
        num_int: string;
        colonia: string;
        estado: string;
        ciudad: string;
        cp: string;
    };
    fechaRegistro: Date;
    activo: boolean;
}

const datosEmpresaSchema = new Schema({
    nombre: { type: String, required: true },
    rutaLogo: { type: String, required: true },
    horarioTrabajo: { type: String, required: false },
    curp: { type: String, required: false },
    nombreContacto: { type: String, required: true },
    correoContacto: { type: String, required: true },
    nombreContactoFacturacion: { type: String, required: false },
    correoContactoFacturacion: { type: String, required: false },
    telefonoContactoFacturacion: {
        type: {
            lada: { type: String, required: true },
            numero: { type: String, required: true },
        }
    },
    telefonos: {
        type: [
            {
                lada: { type: String, required: true },
                numero: { type: String, required: true },
            }
        ]
    },
    direccion: {
        type: {
            calle: { type: String, required: true },
            num_ext: { type: String, required: true },
            num_int: { type: String, required: false },
            colonia: { type: String, required: true },
            estado: { type: String, required: true },
            ciudad: { type: String, required: true },
            cp: { type: String, required: true }
        }
    },
    direccionFacturacion: {
        type: {
            calle: { type: String, required: true },
            num_ext: { type: String, required: true },
            num_int: { type: String, required: false },
            colonia: { type: String, required: true },
            estado: { type: String, required: true },
            ciudad: { type: String, required: true },
            cp: { type: String, required: true }
        }
    },
    fechaRegistro: { type: Date, required: false, default: new Date(Date.now()) },
    activo: { type: Boolean, required: true, default: true }
}, { collection: 'datos-empresa' });


export const DatosEmpresa = mongoose.model<IDatosEmpresa>('DatosEmpresa', datosEmpresaSchema);