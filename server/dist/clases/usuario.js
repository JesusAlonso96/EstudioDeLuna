"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Usuario {
    constructor(id) {
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
        this._id = '';
        this.rol = this.rol_sec = -1;
        this.sucursal = '';
    }
    reiniciarUsuario(id) {
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
        this._id = '';
        this.rol = this.rol_sec = -1;
        this.sucursal = '';
    }
}
exports.default = Usuario;
