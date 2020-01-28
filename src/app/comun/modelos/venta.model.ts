import { Pedido } from './pedido.model';
import { Usuario } from './usuario.model';

export class Venta{
    pedido: Pedido;
    fecha: Date;
    vendedor: Usuario;
    constructor(){
        
    }
}