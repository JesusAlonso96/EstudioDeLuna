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
const usuario_model_1 = require("../modelos/usuario.model");
const servidor_1 = __importDefault(require("../clases/servidor"));
const Socket = __importStar(require("../sockets/socket"));
exports.obtenerConfiguracionUsuario = (req, res) => {
    usuario_model_1.Usuario.findById(res.locals.usuario._id).exec((err, usuario) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener la configuracion del usuario, por favor intentalo de nuevo mas tarde' });
        return res.json(usuario.configuracion);
    });
};
exports.guardarConfiguracionNotificaciones = (req, res) => {
    const configuracionNotificaciones = req.body;
    usuario_model_1.Usuario.findByIdAndUpdate(res.locals.usuario._id, {
        'configuracion.notificaciones': configuracionNotificaciones
    }).exec((err, usuarioActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al guardar', detalles: 'Ocurrio un error al guardar la configuracion del usuario, por favor intentalo de nuevo mas tarde' });
        return res.json({ titulo: 'Configuracion guardada', detalles: 'Se guardo exitosamente la configuracion de notificaciones' });
    });
};
exports.cambiarTema = (req, res) => {
    const tema = req.body.tema;
    usuario_model_1.Usuario.findByIdAndUpdate(res.locals.usuario._id, {
        'configuracion.tema': tema
    }).exec((err, usuarioActualizado) => {
        if (err) {
            console.log(err);
            res.status(422).send({ titulo: 'Error al actualizar el tema', detalles: 'Ocurrio un error al actualizar el tema, intentalo de nuevo mas tarde' });
        }
        return res.status(200).send({ titulo: 'Tema cambiado', detalles: 'Se ha guardado el tema elegido' });
    });
};
exports.cambiarLogotipo = (req, res) => {
    var logo = req.file.path.split('\\')[2];
    usuario_model_1.Usuario.findByIdAndUpdate(res.locals.usuario._id, {
        logo
    }).exec((err, usuarioActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al actualizar el logotipo', detalles: 'Ocurrio un error al actualizar el logotipo, intentalo de nuevo mas tarde' });
        if (usuarioActualizado) {
            obtenerLogoActualizado(res, logo);
            return res.status(200).send({ titulo: 'Logotipo actualizado', detalles: 'Se ha actualizado satisfactoriamente el logotipo' });
        }
    });
};
function obtenerLogoActualizado(res, ruta) {
    const servidor = servidor_1.default.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id == res.locals.usuario._id) {
            servidor.io.in(usuarioConectado.id).emit('nuevo-logotipo', { ruta });
        }
    }
}
