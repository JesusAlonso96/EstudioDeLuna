import { Response } from 'express';
import Servidor from '../clases/servidor';
import * as Socket from './socket';

export function obtenerNuevoElementoAdminOSupervisor(elemento: any, res: Response, tipo: number) {
    const servidor = Servidor.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {//
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && ((usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0) || (usuarioConectado.rol == 1 && usuarioConectado.rol_sec == 0))) {
            switch (tipo) {
                case 0: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor', elemento); break;
                case 1: servidor.io.in(usuarioConectado.id).emit('nueva-familia-eliminada', elemento); break;
                case 2: servidor.io.in(usuarioConectado.id).emit('nueva-familia', elemento); break;
            }
        }
    }
}

export function obtenerNuevoElemento(elemento: any, res: Response, tipo: number) {
    const servidor = Servidor.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0 && usuarioConectado.sucursal == res.locals.usuario.sucursal) {
            switch (tipo) {
                case 0: servidor.io.in(usuarioConectado.id).emit('nuevo-usuario', elemento); break;
                case 1: servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-eliminado', elemento); break;
                case 2: servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-editado', elemento); break;
                case 3: servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-restaurado', elemento); break;
                case 4: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor', elemento); break;
                case 5: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-editado', elemento); break;
                case 6: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-restaurado', elemento); break;
                case 7: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-eliminado', elemento); break;
                case 8: servidor.io.in(usuarioConectado.id).emit('nueva-familia', elemento); break;
                case 9: servidor.io.in(usuarioConectado.id).emit('nueva-familia-restaurada', elemento); break;
            }
        }
    }
}