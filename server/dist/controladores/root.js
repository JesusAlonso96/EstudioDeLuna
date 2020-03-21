"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sucursal_model_1 = require("../modelos/sucursal.model");
const usuario_model_1 = require("../modelos/usuario.model");
exports.nuevaSucursal = (req, res) => {
    new sucursal_model_1.Sucursal(req.body).save((err, sucursal) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al guardar la sucursal', detalles: 'Ocurrio un error guardando la sucursal, por favor intentalo de nuevo mas tarde' });
        return res.json(sucursal);
    });
};
exports.obtenerUsuariosSinSucursal = (req, res) => {
    usuario_model_1.Usuario.find({ sucursal: null }).exec((err, usuarios) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener usuarios', detalles: 'Ocurrio un error al obtener los usuarios, por favor intentalo de nuevo mas tarde' });
        return res.json(usuarios);
    });
};
exports.obtenerSucursales = (req, res) => {
    sucursal_model_1.Sucursal.find({ activa: true }).exec((err, sucursales) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener sucursales', detalles: 'Ocurrio un error al obtener las sucursales, por favor intentalo de nuevo mas tarde' });
        return res.json(sucursales);
    });
};
exports.asignarSucursalUsuario = (req, res) => {
    const usuario = new usuario_model_1.Usuario(req.body.usuario);
    const sucursal = new sucursal_model_1.Sucursal(req.body.sucursal);
    usuario_model_1.Usuario.findByIdAndUpdate(usuario._id, {
        sucursal
    }).exec((err, usuarioActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al actualizar usuario', detalles: 'Ocurrio un error al actualizar el usuario, por favor intentalo de nuevo mas tarde' });
        return res.json(usuarioActualizado);
    });
};
exports.rootMiddleware = (req, res, next) => {
    if (res.locals.usuario.rol == 3) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' });
    }
};
