"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_model_1 = require("../modelos/usuario.model");
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
