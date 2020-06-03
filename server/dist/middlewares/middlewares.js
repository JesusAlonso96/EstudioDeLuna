"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../global/environment");
const usuario_model_1 = require("../modelos/usuario.model");
exports.autenticacionMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const usuario = parseToken(token);
        usuario_model_1.Usuario.findById(usuario.id, (err, usuarioEncontrado) => {
            if (usuarioEncontrado) {
                res.locals.usuario = usuarioEncontrado;
                next();
            }
            else {
                return res.status(422).send({ titulo: 'No autorizado', detalles: 'Necesitar iniciar sesion para tener acceso' });
            }
        });
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'Necesitar iniciar sesion para tener acceso' });
    }
};
exports.rootMiddleware = (req, res, next) => {
    if (res.locals.usuario.rol == 3)
        next();
    else {
        return res.status(401).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' });
    }
};
exports.adminORootMiddleware = (req, res, next) => {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 3)) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' });
    }
};
exports.adminOSupervisorMiddleware = (req, res, next) => {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 1 && res.locals.usuario.rol_sec == 0)) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' });
    }
};
exports.adminOSupervisorORecepcionistaMiddleware = (req, res, next) => {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 1 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 0 && res.locals.usuario.rol_sec == 2)) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' });
    }
};
exports.fotografoMiddleware = (req, res, next) => {
    if (res.locals.usuario.rol !== 0 && res.locals.rol_sec !== 1) {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para crear un pedido' });
    }
    else {
        next();
    }
};
exports.recepcionistaMiddleware = (req, res, next) => {
    if (res.locals.usuario.rol == 0 && res.locals.usuario.rol_sec == 2) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para crear un pedido' });
    }
};
function parseToken(token) {
    return jsonwebtoken_1.default.verify(token.split(' ')[1], environment_1.environment.SECRET);
}
