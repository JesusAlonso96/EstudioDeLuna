import { Request, Response } from 'express';
import { NativeError, Types } from 'mongoose';
import { Compra, ICompra } from '../modelos/compra.model';



export let obtenerComprasSinRegistrar = (req: Request, res: Response) => {
    Compra.aggregate()
        .match({
            sucursal: res.locals.usuario.sucursal
        })
        .lookup({
            from: 'gastoinsumos',
            localField: '_id',
            foreignField: 'compra',
            as: 'gastoinsumo',
        })
        .unwind({
            path: '$gastoinsumo',
            'preserveNullAndEmptyArrays': true
        })
        .match({
            $or: [
                { gastoinsumo: null },
                { 'gastoinsumo.activo': 0 }
            ]
        })
        .lookup({
            from: 'proveedors',
            localField: 'proveedor',
            foreignField: '_id',
            as: 'proveedor',
        })
        .unwind('proveedor')
        .project({
            _id: '$_id',
            fecha: '$fecha',
            numFactura: '$numFactura',
            costoEnvio: '$costoEnvio',
            metodoPago: '$metodoPago',
            iva: '$iva',
            subtotal: '$subtotal',
            total: '$total',
            'proveedor._id': '$proveedor._id',
            'proveedor.nombre': '$proveedor.nombre',
            'proveedor.rfc': '$proveedor.rfc'
        })
        .exec((err: NativeError, compras: ICompra[]) => {
            console.log(compras);
            console.log(err);
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener las compras, intentalo de nuevo mas tarde' });
            return res.status(200).json(compras);
        })
}