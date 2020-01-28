import { Estado } from './estado.model';
export class Municipio {
    nombre: string;
    estado: Estado;
    constructor() {
        this.nombre = "";
        this.estado = new Estado();
    }
}