import { Request, Response } from 'express';
import { NativeError } from 'mongoose';
import Servidor from '../clases/servidor';
import * as Socket from '../sockets/socket';
import { DatosEmpresa, IDatosEmpresa } from '../modelos/datos_empresa.model';

export let obtenerDatosGeneralesEmpresa = (req: Request, res: Response) => {
    DatosEmpresa.findOne()
        .select({ nombre: 1, curp: 1, horarioTrabajo: 1, nombreContacto: 1, correoContacto: 1 })
        .exec((err: NativeError, datosEmpresa: IDatosEmpresa | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener los datos de la empresa', detalles: 'Ocurrio un error al actualizar los datos de la empresa, por favor intentalo de nuevo mas tarde' });
            return res.status(200).json(datosEmpresa);
        })
}
export let obtenerLogotipoEmpresa = (req: Request, res: Response) => {
    DatosEmpresa.findOne()
        .select({ rutaLogo: 1 })
        .exec((err: NativeError, datosEmpresa: IDatosEmpresa | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener los datos de la empresa', detalles: 'Ocurrio un error al actualizar los datos de la empresa, por favor intentalo de nuevo mas tarde' });
            return res.status(200).json(datosEmpresa);
        })
}
export let cambiarLogotipo = (req: Request, res: Response) => {
    var rutaLogo = req.file.path.split('\\')[2];
    DatosEmpresa.findOneAndUpdate({}, {
        rutaLogo
    }).exec((err: NativeError, datosEmpresaActualizados: IDatosEmpresa | null) => {
        if (err) return res.status(422).send({ titulo: 'Error al actualizar el logotipo', detalles: 'Ocurrio un error al actualizar el logotipo, intentalo de nuevo mas tarde' });
        if (datosEmpresaActualizados) {
            obtenerLogoActualizado(res, rutaLogo);
            return res.status(200).send({ titulo: 'Logotipo actualizado', detalles: 'Se ha actualizado satisfactoriamente el logotipo' });
        } else return res.status(422).send({ titulo: 'Error al actualizar el logotipo', detalles: 'Ocurrio un error al actualizar el logotipo, intentalo de nuevo mas tarde' });
    })
}

function obtenerLogoActualizado(res: Response, ruta: string) {
    const servidor = Servidor.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id == res.locals.usuario._id) {
            servidor.io.in(usuarioConectado.id).emit('nuevo-logotipo', { ruta });
        }
    }
}