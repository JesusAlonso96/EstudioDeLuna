import Usuario from './usuario';

export default class ListaUsuarios {
    lista: Usuario[];

    constructor() {
        this.lista = [];
    }
    agregarUsuario(usuario: Usuario): Usuario {
        this.lista.push(usuario);
        console.log('Usuario agregado sin nombre', this.lista);
        return usuario;
    }
    actualizarDatos(id: string, _id: string, nombre: string, rol: number, rol_sec: number) {
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
    obtenerUsuario(_id: string): Usuario | undefined {
        return this.lista.find(usuario => {
            return usuario._id == _id
        });
    }
    obtenerUsuariosEnSala(sala: string) {
        return this.lista.filter(usuario => usuario.sala == sala);
    }
    eliminarUsuario(id: string): Usuario | undefined {
        const usuarioTemporal: Usuario | undefined = this.obtenerUsuario(id);
        this.lista = this.lista.filter(usuario => usuario.id !== id);
        console.log('Usuario eliminado', this.lista);
        return usuarioTemporal;
    }
    actualizarDisponibilidad(id: string, _id: string) {
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