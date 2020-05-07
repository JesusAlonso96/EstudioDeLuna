import {Usuario} from './usuario.model';
import { Sucursal } from './sucursal.model';

export class HistorialEgresoIngreso {
    id: number;
    fecha: Date;
    usuario: Usuario;
    tipo: string;
    descripcion: string;
    cantidadSalida: number;
    cantidadEntrada: number;
    sucursal: Sucursal;
    constructor() { }
}
export class Caja {
    id: number;
    _id: string;
    cantidadTotal: number;
    cantidadEfectivo: number;
    cantidadTarjetas: number;
    historialEgresosIngresos: HistorialEgresoIngreso[] = [];
    sucursal: Sucursal;
    fechaRegistro: Date;
    activa: boolean;
    constructor() { }

}