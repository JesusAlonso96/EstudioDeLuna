import { Familia } from './familia.model';

export class Producto {
    _id: string;
    nombre: string;
    precio: number;
    num_fotos: number;
    familia: Familia;
    b_n: boolean;
    c_r: boolean;
    c_ad: boolean;
    descripcion: string;
    caracteristicas: string[] = [];
    ancho: number;
    alto: number;
    activo: number;
    foto: string;
    constructor() {
        this.b_n = this.c_r = this.c_ad = false;
    }
}
