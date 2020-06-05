import { Sucursal } from './sucursal.model';

export class TipoGastoGeneral {
    _id: string;
    id: number;
    nombre: string;
    descripcion: string;
    tipoDePersona: number;
    nombre_persona: string;
    ape_pat_persona: string;
    ape_mat_persona: string;
    razonSocial: string;
    rfc: string;
    sucursal: Sucursal;
    fechaRegistro: Date;
    activo: number;

    constructor() { }

    nuevoTipoGastoGeneral(_id: string, id: number, nombre: string, descripcion: string, tipoDePersona: number, nombre_persona: string, ape_pat_persona: string, ape_mat_persona: string, razonSocial: string, rfc: string) {
        let nuevoTipoGastoGeneral = new TipoGastoGeneral();
        nuevoTipoGastoGeneral._id = _id;
        nuevoTipoGastoGeneral.id = id;
        nuevoTipoGastoGeneral.nombre = nombre;
        nuevoTipoGastoGeneral.descripcion = descripcion;
        nuevoTipoGastoGeneral.tipoDePersona = tipoDePersona;
        nuevoTipoGastoGeneral.nombre_persona = nombre_persona;
        nuevoTipoGastoGeneral.ape_pat_persona = ape_pat_persona;
        nuevoTipoGastoGeneral.ape_mat_persona = ape_mat_persona;
        nuevoTipoGastoGeneral.razonSocial = razonSocial;
        nuevoTipoGastoGeneral.rfc = rfc;
        return nuevoTipoGastoGeneral;
    }
}