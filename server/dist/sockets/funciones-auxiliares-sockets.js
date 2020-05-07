"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const servidor_1 = __importDefault(require("../clases/servidor"));
const Socket = __importStar(require("./socket"));
function obtenerNuevoElementoAdminOSupervisor(elemento, res, tipo) {
    const servidor = servidor_1.default.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) { //
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && ((usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0) || (usuarioConectado.rol == 1 && usuarioConectado.rol_sec == 0))) {
            switch (tipo) {
                case 0:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor', elemento);
                    break;
                case 1:
                    servidor.io.in(usuarioConectado.id).emit('nueva-familia-eliminada', elemento);
                    break;
                case 2:
                    servidor.io.in(usuarioConectado.id).emit('nueva-familia', elemento);
                    break;
            }
        }
    }
}
exports.obtenerNuevoElementoAdminOSupervisor = obtenerNuevoElementoAdminOSupervisor;
function obtenerNuevoElemento(elemento, res, tipo) {
    const servidor = servidor_1.default.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0 && usuarioConectado.sucursal == res.locals.usuario.sucursal) {
            switch (tipo) {
                case 0:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-usuario', elemento);
                    break;
                case 1:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-eliminado', elemento);
                    break;
                case 2:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-editado', elemento);
                    break;
                case 3:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-restaurado', elemento);
                    break;
                case 4:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor', elemento);
                    break;
                case 5:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-editado', elemento);
                    break;
                case 6:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-restaurado', elemento);
                    break;
                case 7:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-eliminado', elemento);
                    break;
                case 8:
                    servidor.io.in(usuarioConectado.id).emit('nueva-familia', elemento);
                    break;
                case 9:
                    servidor.io.in(usuarioConectado.id).emit('nueva-familia-restaurada', elemento);
                    break;
            }
        }
    }
}
exports.obtenerNuevoElemento = obtenerNuevoElemento;
