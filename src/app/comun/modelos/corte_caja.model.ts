import { Usuario } from './usuario.model';
import { Sucursal } from './sucursal.model';
import { Caja } from './caja.model';

export class CorteCaja {
    _id: string;
    num_corte: number;
    fecha: Date;
    hora: string;
    usuario: Usuario;
    efectivoEsperado: number;
    tarjetaEsperado: number;
    efectivoContado: number;
    tarjetaContado: number;
    fondoEfectivo: number;
    fondoTarjetas: number;
    sucursal: Sucursal;
    caja: Caja;

    constructor() {
    }
}