import { Usuario } from './usuario.model';
import { Cliente } from './cliente.model';
import { Producto } from './producto.model';

export class Pedido {
    _id: string;
    fotografo: Usuario;
    cliente: Cliente;
    fecha_creacion: Date;
    fecha_entrega: Date;
    comentarios: string;
    productos: Producto[];
    status: string;
    urgente: boolean;
    total: number;
    c_retoque: boolean;
    c_adherible: boolean;
    importante: boolean;
    anticipo: number;
    foto: string;
    num_pedido: number;
    metodoPago: string;
    constructor() {
        this.total = 0;
        this.c_retoque = false;
        this.c_adherible = false;
        this.importante = false;
        this.cliente = new Cliente();
        this.productos = [];
        this.fotografo = new Usuario();
        this.comentarios = ' ';
        this.foto = '';
    }
}