import { Request, Response } from 'express';
import { Sucursal, ISucursal } from '../modelos/sucursal.model';
import { NativeError } from 'mongoose';
import { Almacen, IAlmacen } from '../modelos/almacen.model';




export let obtenerSucursales = (req: Request, res: Response) => {
    Sucursal.find({ activa: true })
        .exec((err: NativeError, sucursales: ISucursal[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener las sucursales', detalles: 'No se pudieron obtener las sucursales, intentalo de nuevo mas tarde' });
            return res.status(200).json(sucursales);
        })
}

export let obtenerAlmacenesSucursal = (req: Request, res: Response) => {
    Almacen.find({ activo: true, sucursal: req.params.id })
        .exec((err: NativeError, almacenes: IAlmacen[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener los almacenes', detalles: 'No se pudieron obtener los almacenes, intentalo de nuevo mas tarde' });
            return res.status(200).json(almacenes);
        })
}

