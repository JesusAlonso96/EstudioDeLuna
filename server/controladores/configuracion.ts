import { Request, Response } from 'express';
import { Usuario, IUsuario } from '../modelos/usuario.model';
import { NativeError } from 'mongoose';




export let obtenerConfiguracionUsuario = (req: Request, res: Response) => {
    Usuario.findById(res.locals.usuario._id).exec((err: NativeError, usuario: IUsuario) => {
        if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener la configuracion del usuario, por favor intentalo de nuevo mas tarde' });
        return res.json(usuario.configuracion)
    })
}
export let guardarConfiguracionNotificaciones = (req: Request, res: Response) => {
    const configuracionNotificaciones = req.body;
    Usuario.findByIdAndUpdate(res.locals.usuario._id, {
        'configuracion.notificaciones': configuracionNotificaciones
    }).exec((err: NativeError, usuarioActualizado: IUsuario) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar', detalles: 'Ocurrio un error al guardar la configuracion del usuario, por favor intentalo de nuevo mas tarde' });
        return res.json({ titulo: 'Configuracion guardada', detalles: 'Se guardo exitosamente la configuracion de notificaciones' });
    })
}
export let cambiarTema = (req: Request, res: Response) => {
    const tema: string = req.body.tema;
    Usuario.findByIdAndUpdate(res.locals.usuario._id, {
        'configuracion.tema':tema
    }).exec((err: NativeError, usuarioActualizado: IUsuario)=>{
        if (err) {
            console.log(err);
            res.status(422).send({ titulo: 'Error al actualizar el tema', detalles: 'Ocurrio un error al actualizar el tema, intentalo de nuevo mas tarde' });
        }
        return res.status(200).send({titulo:'Tema cambiado', detalles: 'Se ha guardado el tema elegido'});
    })
}



