import { Request, Response } from 'express';
import { DatosEstudio, IDatosEstudio } from '../modelos/datos_estudio.model';
import { NativeError } from 'mongoose';


export let obtenerDatos = (req: Request, res: Response) => {
    DatosEstudio.findOne()
        .exec((err: NativeError, datos: IDatosEstudio | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener los datos de la empresa, intentalo de nuevo mas tarde' });
            return res.status(200).json(datos);
        })
}