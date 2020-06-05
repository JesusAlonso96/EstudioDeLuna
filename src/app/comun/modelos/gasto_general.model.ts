import { Sucursal } from './sucursal.model';
import { TipoGastoGeneral } from './tipo_gasto_general.model';
import { PORCENTAJE_IVA } from '../constantes/porcentaje-iva.constant';

export class GastoGeneral {
    _id: string;
    id: number;
    tipoGastoGeneral: TipoGastoGeneral;
    metodoPago: string;
    nombre: string;
    razonSocial: string;
    rfc: string;
    subtotal: number;
    ieps: number;
    porcentajeIva: number;
    iva: number | string;
    total: number | string;
    observaciones: string;
    sucursal: Sucursal;
    fechaRegistro: Date;
    activo: number;

    constructor() { 
        this.tipoGastoGeneral = new TipoGastoGeneral();
        this.porcentajeIva = PORCENTAJE_IVA;
        this.subtotal = 0;
        this.total = 0;
        this.iva = 0;
    }

    nuevoGastoGeneral(_id: string, id: number, tipoGastoGeneral: TipoGastoGeneral, metodoPago: string, nombre: string, razonSocial: string, rfc: string, subtotal: number, ieps: number, porcentajeIva: number, iva: number | string, total: number | string, observaciones: string) {
        let nuevoGastoGeneral = new GastoGeneral();
        nuevoGastoGeneral._id = _id;
        nuevoGastoGeneral.id = id;
        nuevoGastoGeneral.tipoGastoGeneral = tipoGastoGeneral;
        nuevoGastoGeneral.metodoPago = metodoPago;
        nuevoGastoGeneral.nombre = nombre;
        nuevoGastoGeneral.razonSocial = razonSocial;
        nuevoGastoGeneral.rfc = rfc;
        nuevoGastoGeneral.subtotal = subtotal;
        nuevoGastoGeneral.ieps = ieps;
        nuevoGastoGeneral.porcentajeIva = porcentajeIva;
        nuevoGastoGeneral.iva = iva;
        nuevoGastoGeneral.total = total;
        nuevoGastoGeneral.observaciones = observaciones;
        return nuevoGastoGeneral;
    }
}