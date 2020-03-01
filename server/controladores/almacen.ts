import { Request, Response } from 'express';
import { Almacen, IAlmacen } from '../modelos/almacen.model';
import { NativeError } from 'mongoose';




export let obtenerAlmacenes = (req: Request, res: Response) => {
    Almacen.find({ activo: true })
        .exec((err: NativeError, almacenes: IAlmacen[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los almacenes, intentalo de nuevo mas tarde' });
            return res.status(200).json(almacenes);
        })
}
export let obtenerAlmacenesEliminados = (req: Request, res: Response) => {
    Almacen.find({ activo: false })
        .exec((err: NativeError, almacenes: IAlmacen[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los almacenes, intentalo de nuevo mas tarde' });
            return res.status(200).json(almacenes);
        })
}
export let obtenerAlmacenPorId = (req: Request, res: Response) => {
    Almacen.findById(req.params.id)
        .exec((err: NativeError, almacen: IAlmacen | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener el almacen, intentalo de nuevo mas tarde' });
            return res.status(200).json(almacen);
        })
}
export let nuevoAlmacen = (req: Request, res: Response) => {
    const nuevoAlmacen = new Almacen(req.body);
    nuevoAlmacen.save((err: any, almacen: IAlmacen) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar', detalles: 'No se pudo guardar el almacen, intentalo de nuevo mas tarde' });
        return res.status(200).send(almacen);
    })
}
export let editarAlmacen = (req: Request, res: Response) => {
    const almacen = new Almacen(req.body);
    if (!almacen.nombre) return res.status(422).send({ titulo: 'Campo nombre obligatorio', detalles: 'Por favor, ingresa el campo nombre' });
    if (!almacen.direccion.calle) return res.status(422).send({ titulo: 'Campo calle obligatorio', detalles: 'Por favor, ingresa el campo calle' });
    if (!almacen.direccion.colonia) return res.status(422).send({ titulo: 'Campo colonia obligatorio', detalles: 'Por favor, ingresa el campo colonia' });
    if (!almacen.direccion.num_ext) return res.status(422).send({ titulo: 'Campo numero exterior obligatorio', detalles: 'Por favor, ingresa el campo numero exterior' });
    if (!almacen.direccion.cp) return res.status(422).send({ titulo: 'Campo codigo postal obligatorio', detalles: 'Por favor, ingresa el campo codigo postal' });
    if (!almacen.direccion.ciudad) return res.status(422).send({ titulo: 'Campo ciudad obligatorio', detalles: 'Por favor, ingresa el campo ciudad' });
    if (!almacen.direccion.estado) return res.status(422).send({ titulo: 'Campo estado obligatorio', detalles: 'Por favor, ingresa el campo estado' });
    Almacen.findByIdAndUpdate(req.params.id, {
        id: almacen.id,
        nombre: almacen.nombre,
        direccion: almacen.direccion,
        insumos: almacen.insumos,
        fechaRegistro: almacen.fechaRegistro,
        activo: almacen.activo
    })
        .exec((err: NativeError, almacen: IAlmacen | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (almacen) return res.status(200).json({ titulo: 'Almacen actualizado', detalles: `El almacen ${almacen.id} ha sido actualizado exitosamente` })
        })
}
export let eliminarAlmacen = (req: Request, res: Response) => {
    Almacen.findByIdAndUpdate(req.params.id, {
        activo: false
    })
        .exec((err: NativeError, almacen: IAlmacen | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (almacen) return res.status(200).json({ titulo: 'Almacen actualizado', detalles: `El almacen ${almacen.id} ha sido eliminado exitosamente` })
        })
}
export let restaurar = (req: Request, res: Response) => {
    Almacen.findByIdAndUpdate(req.params.id, {
        activo: true
    })
        .exec((err: NativeError, almacen: IAlmacen | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (almacen) return res.status(200).json({ titulo: 'Almacen actualizado', detalles: `El almacen ${almacen.id} ha sido restaurado exitosamente` })
        })
}