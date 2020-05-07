import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NativeError } from 'mongoose';
import { environment } from '../global/environment';
import { IUsuario, Usuario } from '../modelos/usuario.model';


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
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'Necesitar iniciar sesion para tener acceso' })
    }
}

export let rootMiddleware = (req: Request, res: Response, next: NextFunction)=> {
    if(res.locals.usuario.rol == 3) next();
    else{
        return res.status(401).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })
    }
}
export let adminORootMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 3)) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })
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