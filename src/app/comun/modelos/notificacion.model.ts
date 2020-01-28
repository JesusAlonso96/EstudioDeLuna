import { Usuario } from './usuario.model';

export class Notificacion {
    titulo: String;
    mensaje: String;
    fecha: Date;
    fecha_pedido: Date;
    num_pedido: Number;
    usuario: Usuario;
    tipo_pedido: Number;
    constructor(titulo, mensaje, usuario, fecha_pedido, num_pedido, tipo_pedido){
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.usuario = usuario;
        this.fecha_pedido = fecha_pedido;
        this.num_pedido = num_pedido;
        this.tipo_pedido = tipo_pedido;
    }

}