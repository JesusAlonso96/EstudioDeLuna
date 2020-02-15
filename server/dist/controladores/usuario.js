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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../global/environment");
const datos_estudio_model_1 = require("../modelos/datos_estudio.model");
const pestana_model_1 = require("../modelos/pestana.model");
const usuario_model_1 = require("../modelos/usuario.model");
const moment_1 = __importDefault(require("moment"));
const asistencia_model_1 = require("../modelos/asistencia.model");
const bcrypt = __importStar(require("bcrypt"));
const familia_model_1 = require("../modelos/familia.model");
const producto_model_1 = require("../modelos/producto.model");
exports.login = (req, res) => {
    const { username, contrasena } = req.body;
    usuario_model_1.Usuario.findOne({ username })
        .exec((err, usuarioEncontrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al iniciar sesión, intentalo de nuevo mas tarde' });
        if (!usuarioEncontrado) {
            return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
        }
        else {
            if (usuarioEncontrado.activo == 0) {
                return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
            }
            if (verificarContrasena(contrasena, usuarioEncontrado.contrasena)) {
                const token = jsonwebtoken_1.default.sign({
                    id: usuarioEncontrado._id,
                    nombre: usuarioEncontrado.nombre,
                    rol: usuarioEncontrado.rol,
                    rol_sec: usuarioEncontrado.rol_sec
                }, environment_1.environment.SECRET, { expiresIn: '8h' });
                return res.json(token);
            }
            else {
                return res.status(422).send({ titulo: 'Datos incorrectos', detalles: 'Correo electronico o contraseña erroneos' });
            }
        }
    });
};
exports.obtenerPestanas = (req, res) => {
    pestana_model_1.Pestana.find({ rol: req.params.rol })
        .exec((err, pestanas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: `Error al obtener los módulos de ${req.params.rol}` });
        if (pestanas)
            return res.json(pestanas);
    });
};
exports.obtenerDatosEstudio = (req, res) => {
    datos_estudio_model_1.DatosEstudio.findOne()
        .exec((err, datos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los datos' });
        return res.json(datos);
    });
};
//posible error
exports.crearAsistencia = (req, res) => {
    let hoy = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    const asistencia = new asistencia_model_1.Asistencia({ fecha: hoy, asistencia: true });
    asistencia.save((err, creada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al crear la asistencia' });
        if (creada) {
            usuario_model_1.Usuario.updateOne({ _id: req.params.id }, {
                $push: { asistencia }
            })
                .exec((err, actualizado) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al crear la asistencia' });
                return res.json(actualizado);
            });
        }
    });
};
exports.obtenerUsuario = (req, res) => {
    usuario_model_1.Usuario.findById(req.params.id)
        .exec((err, usuarioEncontrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se encontro el usuario solicitado' });
        return res.json(usuarioEncontrado);
    });
};
exports.agregarProducto = (req, res) => {
    const producto = new producto_model_1.Producto(req.body);
    producto.save((err, guardado) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
        }
        else {
            familia_model_1.Familia.findOneAndUpdate({ _id: req.body.familia._id }, {
                $push: {
                    productos: guardado
                }
            })
                .exec((err, actualizada) => {
                if (err) {
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
                }
                console.log(actualizada);
            });
            return res.json(guardado);
        }
    });
};
exports.eliminarProducto = (req, res) => {
    producto_model_1.Producto.findOneAndUpdate({ _id: req.params.id }, {
        activo: 0
    }).exec((err, eliminado) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
        }
        return res.json(eliminado);
    });
};
exports.actualizarProducto = (req, res) => {
    producto_model_1.Producto.findOneAndUpdate({ _id: req.body._id }, {
        nombre: req.body.nombre,
        num_fotos: req.body.num_fotos,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        b_n: req.body.b_n,
        c_r: req.body.c_r,
        c_ad: req.body.c_ad,
        ancho: req.body.ancho,
        alto: req.body.alto,
        caracteristicas: req.body.caracteristicas
    })
        .exec(function (err, actualizado) {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el producto' });
        return res.json(actualizado);
    });
};
function verificarContrasena(contrasena, contrasenaModel) {
    return bcrypt.compareSync(contrasena, contrasenaModel);
}
//middlewares
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
function parseToken(token) {
    return jsonwebtoken_1.default.verify(token.split(' ')[1], environment_1.environment.SECRET);
}
