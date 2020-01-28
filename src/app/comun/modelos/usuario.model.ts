import { Pedido } from './pedido.model';

export class Usuario {
    _id: String;
    nombre: String;
    username: String;
    ape_pat: String;
    ape_mat: String;
    email: String;
    telefono: Number;
    contrasena: String;
    rol: Number;
    rol_sec: Number;
    ocupado: Boolean;
    asistencia: any[];
    pedidosTomados: Pedido[];
    activo: Number;
    constructor();
    constructor(_id?: String, nombre?: String, username?: String, ape_pat?: String,
        ape_mat?: String, email?: String, telefono?: Number, rol?: Number, rol_sec?: Number, ocupado?: Boolean, asistencia?: any[], pedidosTomados?: Pedido[], activo?: Number);
    constructor(_id?: String, nombre?: String, username?: String, ape_pat?: String,
        ape_mat?: String, email?: String, telefono?: Number, rol?: Number, rol_sec?: Number, ocupado?: Boolean, asistencia?: any[], pedidosTomados?: Pedido[], activo?: Number) {
        this._id = _id;
        this.nombre = nombre;
        this.username = username;
        this.ape_pat = ape_pat;
        this.ape_mat = ape_mat;
        this.email = email;
        this.telefono = telefono;
        this.rol = rol;
        this.rol_sec = rol_sec;
        this.ocupado = ocupado;
        this.asistencia = asistencia;
        this.pedidosTomados = pedidosTomados;
        this.activo = activo;
    }
}