import { Request, Response } from 'express';
import { NativeError, Types } from 'mongoose';
import { Traspaso, ITraspaso } from '../modelos/traspaso';


export let obtenerTraspasosPendientes = (req: Request, res: Response) => {
    Traspaso.aggregate()
        .lookup({
            from: "almacens",
            localField: "almacenOrigen",
            foreignField: "_id",
            as: "almacenOrigen",
        })
        .unwind('almacenOrigen')
        .lookup({
            from: "sucursals",
            localField: "almacenOrigen.sucursal",
            foreignField: "_id",
            as: "almacenOrigen.sucursal",
        })
        .unwind('almacenOrigen.sucursal')
        .lookup({
            from: "almacens",
            localField: "almacenDestino",
            foreignField: "_id",
            as: "almacenDestino",
        })
        .unwind('almacenDestino')
        .lookup({
            from: "sucursals",
            localField: "almacenDestino.sucursal",
            foreignField: "_id",
            as: "almacenDestino.sucursal",
        })
        .unwind('almacenDestino.sucursal')
        .lookup({
            from: "productoproveedors",
            localField: "insumo",
            foreignField: "_id",
            as: "insumo",
        })
        .unwind('insumo')
        .match({
            activo: true,
            estado: 'Enviado',
            $or: [
                { 'almacenOrigen.sucursal._id': Types.ObjectId(res.locals.usuario.sucursal) },
                { 'almacenDestino.sucursal._id': Types.ObjectId(res.locals.usuario.sucursal) },
            ]
        })
        .project({
            _id: '$_id',
            id: '$id',
            'almacenOrigen._id': '$almacenOrigen._id',
            'almacenOrigen.nombre': '$almacenOrigen.nombre',
            'almacenOrigen.sucursal._id': '$almacenOrigen.sucursal._id',
            'almacenOrigen.sucursal.nombre': '$almacenOrigen.sucursal.nombre',
            'almacenDestino._id': '$almacenDestino._id',
            'almacenDestino.nombre': '$almacenDestino.nombre',
            'almacenDestino.sucursal._id': '$almacenDestino.sucursal._id',
            'almacenDestino.sucursal.nombre': '$almacenDestino.sucursal.nombre',
            'insumo._id': '$insumo._id',
            'insumo.codigoBarras': '$insumo.codigoBarras',
            'insumo.nombre': '$insumo.nombre',
            cantidadMovimiento: '$cantidadMovimiento',
            observaciones: '$observaciones'
        })
        .exec((err: NativeError, traspasos: ITraspaso[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener los traspasos pendientes', detalles: 'No se pudieron obtener los traspasos pendientes, intentalo de nuevo mas tarde' });
            return res.status(200).json(traspasos);
        })
}

export let nuevoTraspaso = (req: Request, res: Response) => {
    const nuevoTraspaso = new Traspaso(req.body);
    nuevoTraspaso.usuario = res.locals.usuario._id;
    nuevoTraspaso.save((err: any, traspaso: ITraspaso) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar', detalles: 'No se pudo guardar el traspaso, intentalo de nuevo mas tarde' });
        return res.status(200).send(traspaso);
    })
}

export let eliminarTraspaso = (req: Request, res: Response) => {
    Traspaso.findByIdAndUpdate(req.params.id, {
        activo: false
    })
        .exec((err: NativeError, traspaso: ITraspaso | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al eliminar el traspaso, intentalo de nuevo mas tarde' });
            if (traspaso) return res.status(200).json({ titulo: 'Traspaso eliminado', detalles: `El traspaso ha sido eliminado exitosamente` })
        })
}

export let editarEstadoTraspaso = (req: Request, res: Response) => {
    const estado = req.body.estado;
    Traspaso.findByIdAndUpdate(req.params.id, {
        estado
    })
        .exec((err: NativeError, traspaso: ITraspaso | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar el estado del traspaso, intentalo de nuevo mas tarde' });
            if (traspaso) return res.status(200).json({ titulo: 'Estado del traspaso actualizado', detalles: `El estado del traspaso han sido actualizado exitosamente` })
        })
}
