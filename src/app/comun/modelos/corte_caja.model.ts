import { Usuario } from './usuario.model';

export class CorteCaja {
    _id: string;
    fecha: Date;
    hora: string;
    usuario: Usuario;
    efectivoEsperado: number;
    tarjetaEsperado: number;
    efectivoContado: number;
    tarjetaContado: number;
    fondoEfectivo: number;
    fondoTarjetas: number;
    
    constructor(){
     }
}