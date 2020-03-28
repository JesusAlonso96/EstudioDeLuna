
export default class Usuario {
    id: string;
    nombre: string;
    sala: string;
    _id: string;
    rol: number;
    rol_sec: number;
    sucursal: string;
    constructor(id: string){
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
        this._id = '';
        this.rol = this.rol_sec = -1;
        this.sucursal = '';
    }
    reiniciarUsuario(id: string) {
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
        this._id = '';
        this.rol = this.rol_sec = -1;
        this.sucursal = '';
    }
}