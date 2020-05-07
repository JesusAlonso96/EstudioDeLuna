import { Request, Response } from 'express';
import { Almacen, IAlmacen } from '../modelos/almacen.model';
import { NativeError, Types } from 'mongoose';
import { IProductoProveedor } from '../modelos/producto_proveedor.model';




export let obtenerAlmacenes = (req: Request, res: Response) => {
    Almacen.find({ activo: true, sucursal: res.locals.usuario.sucursal })
        .exec((err: NativeError, almacenes: IAlmacen[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los almacenes, intentalo de nuevo mas tarde' });
            return res.status(200).json(almacenes);
        })
}
export let obtenerAlmacenesEliminados = (req: Request, res: Response) => {
    Almacen.find({ activo: false, sucursal: res.locals.usuario.sucursal })
        .exec((err: NativeError, almacenes: IAlmacen[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los almacenes, intentalo de nuevo mas tarde' });
            return res.status(200).json(almacenes);
        })
}
export let obtenerAlmacenPorId = (req: Request, res: Response) => {
    Almacen.findById(req.params.id)
        .populate({ path: 'insumos.insumo', select: 'id codigoBarras nombre detalles' })
        .exec((err: NativeError, almacen: IAlmacen | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener el almacen, intentalo de nuevo mas tarde' });
            return res.status(200).json(almacen);
        })
}
export let obtenerMovimientoAlmacenPorId = (req: Request, res: Response) => {
    Almacen.aggregate()
    .unwind('historialMov')
    .match({
        _id: Types.ObjectId(req.params.id),
        'historialMov._id': Types.ObjectId(req.params.idMovimiento),
        activo: true,
        sucursal: res.locals.usuario.sucursal
    })
    .lookup({
        from: "productoproveedors",
        localField: "historialMov.insumo",
        foreignField: "_id",
        as: "historialMov.insumo",
    })
    .unwind('historialMov.insumo')
    .lookup({
        from: "usuarios",
        localField: "historialMov.usuario",
        foreignField: "_id",
        as: "historialMov.usuario",
    })
    .unwind('historialMov.usuario')
    .lookup({
        from: "inventarios",
        localField: "historialMov.inventario",
        foreignField: "_id",
        as: "historialMov.inventario",
    })
    .unwind({
        path: "$historialMov.inventario",
        "preserveNullAndEmptyArrays": true
    })
    .lookup({
        from: "traspasos",
        localField: "historialMov.traspaso",
        foreignField: "_id",
        as: "historialMov.traspaso",
    })
    .unwind({
        path: "$historialMov.traspaso",
        "preserveNullAndEmptyArrays": true
    })
    .project({
        _id: '$historialMov._id',
        fecha: '$historialMov.fecha',
        numFactura: '$historialMov.numFactura',
        'insumo._id': '$historialMov.insumo._id',
        'insumo.nombre': '$historialMov.insumo.nombre',
        'inventario._id': '$historialMov.inventario._id',
        'inventario.id': '$historialMov.inventario.id',
        'traspaso._id': '$historialMov.traspaso._id',
        'traspaso.id': '$historialMov.traspaso.id',
        'usuario._id': '$historialMov.usuario._id',
        'usuario.nombre': '$historialMov.usuario.nombre',
        'usuario.ape_pat': '$historialMov.usuario.ape_pat',
        'usuario.ape_mat': '$historialMov.usuario.ape_mat',
        tipo: '$historialMov.tipo',
        cantidadMovimiento: '$historialMov.cantidadMovimiento',
        existenciaActual: '$historialMov.existenciaActual',
        observaciones: '$historialMov.observaciones',
        'almacen._id': '$_id',
        'almacen.nombre': '$nombre'
    })
    .exec((err: NativeError, movimientos: any[]) => {
        if (err) return res.status(422).send({ titulo: 'Error al obtener el historial de movimientos', detalles: 'No se pudo obtener el historial de movimientos, intentalo de nuevo mas tarde' });
        if (movimientos.length == 0) return res.status(404).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los detalles del movimiento, puede que no exista' });
        return res.status(200).json(movimientos[0]);
    })
}
export let obtenerHistorialMovimientos = (req: Request, res: Response) => {
    Almacen.aggregate()
        .unwind('historialMov')
        .lookup({
            from: "productoproveedors",
            localField: "historialMov.insumo",
            foreignField: "_id",
            as: "historialMov.insumo",
        })
        .unwind('historialMov.insumo')
        .match({
            activo: true,
            sucursal: res.locals.usuario.sucursal
        })
        .project({
            _id: '$historialMov._id',
            fecha: '$historialMov.fecha',
            'insumo._id': '$historialMov.insumo._id',
            'insumo.nombre': '$historialMov.insumo.nombre',
            'tipo': '$historialMov.tipo',
            'cantidadMovimiento': '$historialMov.cantidadMovimiento',
            'almacen._id': '$_id',
            'almacen.nombre': '$nombre'
        })
        .exec((err: NativeError, movimientos: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener el historial de movimientos', detalles: 'No se pudo obtener el historial de movimientos, intentalo de nuevo mas tarde' });
            return res.status(200).json(movimientos);
        })
}

export let nuevoAlmacen = (req: Request, res: Response) => {
    const nuevoAlmacen = new Almacen(req.body);
    nuevoAlmacen.sucursal = res.locals.usuario.sucursal;
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
export let editarInsumosAlmacen = (req: Request, res: Response) => {
    const insumos = req.body;
    Almacen.findByIdAndUpdate(req.params.id, {
        insumos
    })
        .exec((err: NativeError, almacen: IAlmacen | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (almacen) return res.status(200).json({ titulo: 'Insumos del almacen actualizado', detalles: `Los insumos del almacen ${almacen.id} han sido actualizados exitosamente` })
        })
}

export let editarInsumoAlmacen = (req: Request, res: Response) => {
    const movimiento = req.body;
    let cantidadMovimiento = 0;
    switch (movimiento.tipo) {
        case 'Baja':
        case 'Baja inventario':
        case 'Envio traspaso': cantidadMovimiento -= movimiento.cantidadMovimiento;
            break;
        case 'Traspaso eliminado':
        case 'Alta inventario':
        case 'Recepcion traspaso': cantidadMovimiento += movimiento.cantidadMovimiento;
            break;
    }
    Almacen.findOneAndUpdate({ _id: req.params.id, 'insumos.insumo': req.params.idInsumo },
        {
            $inc: {
                'insumos.$.existencia': cantidadMovimiento
            }
        })
        .exec((err: NativeError, almacen: IAlmacen | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar la exitencia del insumo', detalles: 'No se pudo obtener el almacen, intentalo de nuevo mas tarde' });
            let insumo = null;
            movimiento.insumo = req.params.idInsumo;
            movimiento.usuario = res.locals.usuario._id;
            if (almacen) {
                let posicionInsumo = almacen.insumos.findIndex(insumo => {
                    return insumo.insumo._id == req.params.idInsumo;
                });
                if (posicionInsumo == -1) {
                    return res.status(404).json({ titulo: 'Error al actualizar la exitencia del insumo', detalles: `No se pudo obtener el insumo, probablemente no exista123` })
                } else {
                    movimiento.existenciaActual = almacen.insumos[posicionInsumo].existencia;
                }
                Almacen.findByIdAndUpdate(req.params.id, {
                    $push: {
                        historialMov: movimiento
                    }
                })
                    .exec((err: NativeError, almacenGuardado: IAlmacen | null) => {
                        console.log(err);
                        if (err) return res.status(422).send({ titulo: 'Error al actualizar la exitencia del insumo', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
                        if (almacenGuardado) return res.status(200).send(almacenGuardado);
                    })
            } else {
                if (movimiento.tipo == 'Recepcion traspaso') {
                    insumo = {
                        existencia: movimiento.cantidadMovimiento,
                        insumo: req.params.idInsumo
                    };
                    movimiento.existenciaActual = 0;
                    Almacen.findByIdAndUpdate(req.params.id, {
                        $push: {
                            insumos: insumo,
                            historialMov: movimiento
                        }
                    })
                        .exec((err: NativeError, almacenGuardado: IAlmacen | null) => {
                            console.log(err);
                            if (err) return res.status(422).send({ titulo: 'Error al actualizar la exitencia del insumo', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
                            if (almacenGuardado) return res.status(200).send(almacenGuardado);
                        })
                } else {
                    return res.status(404).json({ titulo: 'Error al actualizar la exitencia del insumo', detalles: `No se pudo obtener el almacen, probablemente no exista` })
                }
            }
        })
}