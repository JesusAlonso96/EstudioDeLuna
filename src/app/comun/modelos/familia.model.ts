import { Producto } from './producto.model';

export class Familia{
    _id: String;
    nombre: String;
    productos: Producto[];
    constructor(){
        this.nombre = '';
    }
}