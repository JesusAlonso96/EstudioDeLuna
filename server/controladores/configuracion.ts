import { Request, Response } from 'express';
import { Usuario, IUsuario } from '../modelos/usuario.model';
import { NativeError } from 'mongoose';
import Servidor from '../clases/servidor';
import * as Socket from '../sockets/socket';



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
export let cambiarLogotipo = (req: Request, res: Response) => {
    var logo = req.file.path.split('\\')[2];
    Usuario.findByIdAndUpdate(res.locals.usuario._id, {
        logo
    }).exec((err: NativeError, usuarioActualizado: IUsuario | null)=> {
        if(err) return res.status(422).send({ titulo: 'Error al actualizar el logotipo', detalles: 'Ocurrio un error al actualizar el logotipo, intentalo de nuevo mas tarde' });
        if(usuarioActualizado){
            obtenerLogoActualizado(res,logo);
            return res.status(200).send({titulo:'Logotipo actualizado', detalles:'Se ha actualizado satisfactoriamente el logotipo'});
        }
    })
}


function obtenerLogoActualizado(res: Response, ruta: string){
    const servidor = Servidor.instance;
    for( let usuarioConectado of Socket.usuariosConectados.lista){
        if(usuarioConectado !== undefined && usuarioConectado._id == res.locals.usuario._id){
            servidor.io.in(usuarioConectado.id).emit('nuevo-logotipo', {ruta});
        }
    }
}