import { Request, Response, NextFunction } from 'express';
import { Sucursal, ISucursal } from '../modelos/sucursal.model';
import { Usuario, IUsuario } from '../modelos/usuario.model';
import { NativeError } from 'mongoose';

export let nuevaSucursal = (req: Request, res: Response) => {
    new Sucursal(req.body).save((err: any, sucursal: ISucursal) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar la sucursal', detalles: 'Ocurrio un error guardando la sucursal, por favor intentalo de nuevo mas tarde' });
        return res.json(sucursal);
    })
}

export let obtenerUsuariosSinSucursal = (req: Request, res: Response) => {
    Usuario.find({ sucursal: null }).exec((err: NativeError, usuarios: IUsuario[]) => {
        if(err) return res.status(422).send({titulo:'Error al obtener usuarios', detalles: 'Ocurrio un error al obtener los usuarios, por favor intentalo de nuevo mas tarde'});
        return res.json(usuarios);
    })
}
export let obtenerSucursales = (req: Request, res: Response) => {
    Sucursal.find({activa:true}).exec((err: NativeError, sucursales: ISucursal[])=> {
        if(err) return res.status(422).send({titulo:'Error al obtener sucursales', detalles: 'Ocurrio un error al obtener las sucursales, por favor intentalo de nuevo mas tarde'});
        return res.json(sucursales);
    })
}
export let asignarSucursalUsuario = (req: Request,res: Response) => {
    const usuario = new Usuario(req.body.usuario);
    const sucursal = new Sucursal(req.body.sucursal);
    Usuario.findByIdAndUpdate(usuario._id, {
        sucursal
    }).exec((err: NativeError, usuarioActualizado: IUsuario)=> {
        if(err) return res.status(422).send({titulo:'Error al actualizar usuario', detalles: 'Ocurrio un error al actualizar el usuario, por favor intentalo de nuevo mas tarde'});
        return res.json(usuarioActualizado);
    })
}
export let rootMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.usuario.rol == 3) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })
    }
}