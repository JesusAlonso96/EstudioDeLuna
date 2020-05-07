import { Request, Response } from 'express';
import { Inventario, IInventario } from '../modelos/inventario.model';
import { NativeError } from 'mongoose';




export let obtenerInventarios = (req: Request, res: Response) => {
    Inventario.find({ activo: true, sucursal: res.locals.usuario.sucursal })
        .populate({ path: 'almacen', select: 'id nombre' })
        .populate({ path: 'usuario', select: 'id nombre apepat apemat' })
        .exec((err: NativeError, inventarios: IInventario[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los inventarios, intentalo de nuevo mas tarde' });
            return res.status(200).json(inventarios);
        })
}
export let obtenerInventarioPorId = (req: Request, res: Response) => {
    Inventario.findById(req.params.id)
        .populate({ path: 'insumos.insumo', select: 'id codigoBarras nombre detalles' })
        .exec((err: NativeError, inventario: IInventario | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudo obtener el inventario, intentalo de nuevo mas tarde' });
            return res.status(200).json(inventario);
        })
}
export let nuevoInventario = (req: Request, res: Response) => {
    const nuevoInventario = new Inventario(req.body);
    nuevoInventario.usuario = res.locals.usuario._id;
    nuevoInventario.sucursal = res.locals.usuario.sucursal;
    nuevoInventario.save((err: any, inventario: IInventario) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar', detalles: 'No se pudo guardar el inventario, intentalo de nuevo mas tarde' });
        return res.status(200).send(inventario);
    })
}