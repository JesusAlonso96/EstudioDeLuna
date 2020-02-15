import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../global/environment';
import { DatosEstudio, IDatosEstudio } from '../modelos/datos_estudio.model';
import { IPestana, Pestana } from '../modelos/pestana.model';
import { IUsuario, Usuario } from '../modelos/usuario.model';
import moment from 'moment';
import { Asistencia, IAsistencia } from '../modelos/asistencia.model';
import * as bcrypt from 'bcrypt';
import { Familia } from '../modelos/familia.model';
import { Producto, IProducto } from '../modelos/producto.model';
import { NativeError } from 'mongoose';

export let login = (req: Request, res: Response) => {
    const { username, contrasena } = req.body;
    Usuario.findOne({ username })
        .exec((err: NativeError, usuarioEncontrado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al iniciar sesión, intentalo de nuevo mas tarde' });
            if (!usuarioEncontrado) {
                return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
            } else {
                if (usuarioEncontrado.activo == 0) {
                    return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
                }
                if (verificarContrasena(contrasena, usuarioEncontrado.contrasena)) {
                    const token = jwt.sign({
                        id: usuarioEncontrado._id,
                        nombre: usuarioEncontrado.nombre,
                        rol: usuarioEncontrado.rol,
                        rol_sec: usuarioEncontrado.rol_sec
                    }, environment.SECRET, { expiresIn: '8h' });
                    return res.json(token);
                } else {
                    return res.status(422).send({ titulo: 'Datos incorrectos', detalles: 'Correo electronico o contraseña erroneos' })
                }
            }
        });
}
export let obtenerPestanas = (req: Request, res: Response) => {
    Pestana.find({ rol: req.params.rol })
        .exec((err: NativeError, pestanas: IPestana[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: `Error al obtener los módulos de ${req.params.rol}` });
            if (pestanas) return res.json(pestanas);
        })
}
export let obtenerDatosEstudio = (req: Request, res: Response) => {
    DatosEstudio.findOne()
        .exec((err: NativeError, datos: IDatosEstudio) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los datos' });
            return res.json(datos);
        })
}
//posible error
export let crearAsistencia = (req: Request, res: Response) => {
    let hoy = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    const asistencia = new Asistencia({ fecha: hoy, asistencia: true });
    asistencia.save((err: NativeError, creada: IAsistencia) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al crear la asistencia' });
        if (creada) {
            Usuario.updateOne({ _id: req.params.id }, {
                $push: { asistencia }
            })
                .exec((err: NativeError, actualizado: IUsuario) => {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al crear la asistencia' });
                    return res.json(actualizado);
                });
        }
    });
}
export let obtenerUsuario = (req: Request, res: Response) => {
    Usuario.findById(req.params.id)
        .exec((err: NativeError, usuarioEncontrado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se encontro el usuario solicitado' });
            return res.json(usuarioEncontrado);
        })
}
export let agregarProducto = (req: Request, res: Response) => {
    const producto = new Producto(req.body);
    producto.save((err: NativeError, guardado: IProducto) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
        } else {
            Familia.findOneAndUpdate({ _id: req.body.familia._id }, {
                $push: {
                    productos: guardado
                }
            })
                .exec((err: NativeError, actualizada: any) => {
                    if (err) {
                        return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
                    }
                    console.log(actualizada);
                })
            return res.json(guardado);
        }
    })
}
export let eliminarProducto = (req: Request, res: Response) => {
    Producto.findOneAndUpdate({ _id: req.params.id }, {
        activo: 0
    }).exec((err: NativeError, eliminado: IProducto) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
        }
        return res.json(eliminado);
    })
}
export let actualizarProducto = (req: Request, res: Response) => {
    Producto.findOneAndUpdate({ _id: req.body._id }, {
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
        .exec(function (err: NativeError, actualizado: IProducto) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el producto' });
            return res.json(actualizado);
        })
}
function verificarContrasena(contrasena: string, contrasenaModel: string) {
    return bcrypt.compareSync(contrasena, contrasenaModel);
}






















//middlewares
export let autenticacionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (token) {
        const usuario: IUsuario = parseToken(token);
        Usuario.findById(usuario.id, (err: NativeError, usuarioEncontrado: IUsuario) => {
            if (usuarioEncontrado) {
                res.locals.usuario = usuarioEncontrado;
                next();
            } else {
                return res.status(422).send({ titulo: 'No autorizado', detalles: 'Necesitar iniciar sesion para tener acceso' })
            }
        });
    }
}
export let adminOSupervisorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 1 && res.locals.usuario.rol_sec == 0)) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })
    }
}
export let adminOSupervisorORecepcionistaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 1 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 0 && res.locals.usuario.rol_sec == 2)) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })
    }
}
function parseToken(token: any) {
    return <IUsuario>jwt.verify(token.split(' ')[1], environment.SECRET);
}

