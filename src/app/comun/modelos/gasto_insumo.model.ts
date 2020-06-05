import { Sucursal } from './sucursal.model';
import { PORCENTAJE_IVA } from '../constantes/porcentaje-iva.constant';
import { Compra } from './compra.model';

export class GastoInsumo {
    _id: string;
    id: number;
    compra: Compra;
    razonSocial: string;
    rfc: string;
    observaciones: string;
    sucursal: Sucursal;
    fechaRegistro: Date;
    activo: number;

    constructor() { 
        this.compra = new Compra();
    }

    nuevoGastoInsumo(_id: string, id: number, compra: Compra, razonSocial: string, rfc: string, observaciones: string) {
        let nuevoGastoInsumo = new GastoInsumo();
        nuevoGastoInsumo._id = _id;
        nuevoGastoInsumo.id = id;
        nuevoGastoInsumo.compra = compra;
        nuevoGastoInsumo.razonSocial = razonSocial;
        nuevoGastoInsumo.rfc = rfc;
        nuevoGastoInsumo.observaciones = observaciones;
        return nuevoGastoInsumo;
    }
}