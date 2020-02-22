"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListaUsuarios {
    constructor() {
        this.lista = [];
    }
    agregarUsuario(usuario) {
        this.lista.push(usuario);
        console.log('Usuario agregado sin nombre', this.lista);
        return usuario;
    }
    actualizarDatos(id, _id, nombre, rol, rol_sec) {
        for (let usuario of this.lista) {
            if (usuario.id == id) {
                usuario.nombre = nombre;
                usuario._id = _id;
                usuario.rol = rol;
                usuario.rol_sec = rol_sec;
            }
        }
        console.log('Actualizando usuario', this.lista);
    }
    obtenerListaUsuarios() {
        return this.lista;
    }
    obtenerUsuario(_id) {
        return this.lista.find(usuario => {
            return usuario._id == _id;
        });
    }
    obtenerUsuariosEnSala(sala) {
        return this.lista.filter(usuario => usuario.sala == sala);
    }
    eliminarUsuario(id) {
        const usuarioTemporal = this.obtenerUsuario(id);
        this.lista = this.lista.filter(usuario => usuario.id !== id);
        console.log('Usuario eliminado', this.lista);
        return usuarioTemporal;
    }
    actualizarDisponibilidad(id, _id) {
        for (let usuario of this.lista) {
            if (usuario._id == _id) {
                usuario.nombre = 'sin-nombre';
                usuario._id = '';
                usuario.id = id;
            }
        }
        console.log('Usuario cerró sesión', this.lista);
    }
    obtenerFotografosConectados() {
    }
}
exports.default = ListaUsuarios;
