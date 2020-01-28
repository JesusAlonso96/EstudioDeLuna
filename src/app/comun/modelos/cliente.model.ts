import { Pedido } from './pedido.model';

export class Cliente {
    _id: string;
    nombre: string;
    username: string;
    ape_pat: string;
    ape_mat: string;
    email: string;
    telefono: number;
    contrasena: string;
    razonSocial: string;
    rfc: string;
    direccion: string;
    colonia: string;
    municipio: string;
    estado: string;
    cp: number;
    num_ext: number;
    num_int: number;
    pedidos: Pedido[];
    fecha_registro: Date;
    activo: number;
    constructor();
    constructor(_id?: string, nombre?: string, username?: string, ape_pat?: string, ape_mat?: string, email?: string, telefono?: number, contrasena?: string, razonSocial?: string,
        rfc?: string, direccion?: string, colonia?: string, municipio?: string, estado?: string, cp?: number, num_ext?: number, num_int?: number, pedidos?: Pedido[], fecha_registro?: Date, activo?: number);
    constructor(_id?: string, nombre?: string, username?: string, ape_pat?: string, ape_mat?: string, email?: string, telefono?: number, contrasena?: string, razonSocial?: string,
        rfc?: string, direccion?: string, colonia?: string, municipio?: string, estado?: string, cp?: number, num_ext?: number, num_int?: number, pedidos?: Pedido[], fecha_registro?: Date, activo?: number) {
        this._id = _id;
        this.nombre = nombre;
        this.username = username;
        this.ape_pat = ape_pat;
        this.ape_mat = ape_mat;
        this.email = email;
        this.telefono = telefono;
        this.contrasena = contrasena;
        this.razonSocial = razonSocial;
        this.rfc = rfc;
        this.direccion = direccion;
        this.colonia = colonia;
        this.municipio = municipio;
        this.estado = estado;
        this.cp = cp;
        this.num_ext = num_ext;
        this.num_int = num_int;
        this.pedidos = pedidos;
        this.fecha_registro = fecha_registro;
        this.activo = activo;
    }

}