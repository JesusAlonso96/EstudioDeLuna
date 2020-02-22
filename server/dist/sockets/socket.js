"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_1 = __importDefault(require("../clases/usuario"));
const listaUsuarios_1 = __importDefault(require("../clases/listaUsuarios"));
exports.usuariosConectados = new listaUsuarios_1.default();
exports.obtenerUsuariosConectados = function () {
    return exports.usuariosConectados;
};
exports.conectarCliente = (cliente) => {
    const usuario = new usuario_1.default(cliente.id);
    exports.usuariosConectados.agregarUsuario(usuario);
};
exports.desconectar = (cliente) => {
    cliente.on('disconnect', () => {
        console.log('cliente desconectado');
        exports.usuariosConectados.eliminarUsuario(cliente.id);
    });
};
exports.configurarUsuario = (cliente, io) => {
    cliente.on('configurar-usuario', (usuario, callback) => {
        exports.usuariosConectados.actualizarDatos(cliente.id, usuario._id, usuario.nombre, usuario.rol, usuario.rol_sec);
        callback({ ok: true, mensaje: 'Usuario configurado' });
    });
};
exports.cerrarSesion = (cliente) => {
    cliente.on('cerrar-sesion', (usuario, callback) => {
        exports.usuariosConectados.actualizarDisponibilidad(cliente.id, usuario._id);
        callback({ ok: true, mensaje: 'Usuario no disponible' });
    });
};
