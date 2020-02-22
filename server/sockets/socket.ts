import { Socket } from 'socket.io';
import Usuario from '../clases/usuario';
import ListaUsuarios from '../clases/listaUsuarios';

export var usuariosConectados: ListaUsuarios = new ListaUsuarios(); 
export const obtenerUsuariosConectados = function() {
    return usuariosConectados;
}
export const conectarCliente = (cliente: Socket) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregarUsuario(usuario);
}
export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        console.log('cliente desconectado');
        usuariosConectados.eliminarUsuario(cliente.id);
    });
}
export const configurarUsuario = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('configurar-usuario', (usuario: Usuario, callback: Function) => {
        usuariosConectados.actualizarDatos(cliente.id, usuario._id,usuario.nombre, usuario.rol, usuario.rol_sec);
        callback({ ok: true, mensaje: 'Usuario configurado' });
    })
}
export const cerrarSesion = (cliente: Socket) => {
    cliente.on('cerrar-sesion', (usuario: Usuario, callback: Function) => {
        usuariosConectados.actualizarDisponibilidad(cliente.id, usuario._id)
        callback({ ok: true, mensaje: 'Usuario no disponible' });
    });
}