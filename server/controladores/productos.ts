import { Request, Response } from 'express';
import { Familia, IFamilia } from '../modelos/familia.model';
import { NativeError, Types } from 'mongoose';
import { Producto, IProducto } from '../modelos/producto.model';

export let obtenerFamilias = (req: Request, res: Response) => {
    Familia.find({ activa: 1 })
        .exec((err: NativeError, familias: IFamilia[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar las familias' });
            return res.json(familias);
        })
}
export let obtenerProductos = (req: Request, res: Response) => {
    Producto.find({ familia: req.params.idFamilia, activo: 1 })
        .exec((err: NativeError, productosEncontrados: IProducto[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los productos de la familia' });
            return res.json(productosEncontrados);
        })
}
export let obtenerProductosInactivos = (req: Request, res: Response) => {

}
export let obtenerFamiliasYProductos = (req: Request, res: Response) => {
    Familia.find({ activa: 1 })
        .populate({
            path: 'productos',
            match: { activo: 1 }
        })
        .sort({ nombre: 1 })
        .exec((err: NativeError, familias: IFamilia[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un problema intentando obtener los productos' });
            res.json(familias);
        })

}
export let obtenerFamiliasYProductosInactivos = (req: Request, res: Response) => {
    Familia.find({ activa: 1 })
        .populate({
            path: 'productos',
            match: { activo: 0 }
        })
        .sort({ nombre: 1 })
        .exec((err: NativeError, familias: IFamilia[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un problema intentando obtener los productos' });
            res.json(familias);
        })
}
export let obtenerProductosPorTam = (req: Request, res: Response) => {
    Producto
        .aggregate()
        .lookup({
            from: "familias",
            localField: "familia",
            foreignField: "_id",
            as: "familia"
        })
        .match({
            "familia._id": Types.ObjectId(req.params.id),
            activo: 1
        })
        .group({
            _id: { ancho: '$ancho', alto: '$alto' }
        })
        .project({
            _id: 1, precio: 1
        })
        .sort({
            _id: 1,

        })
        .exec((err: NativeError, productos: IProducto[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos' })
            res.json(productos);
        })
}
export let obtenerProductosPorCantidad = (req: Request, res: Response) => {
    Producto
        .aggregate()
        .lookup({
            from: "familias",
            localField: "familia",
            foreignField: "_id",
            as: "familia"
        })
        .match({
            "familia._id": Types.ObjectId(req.params.id),
            activo: 1
        })
        .group({
            _id: "$num_fotos"
        })
        .sort({
            _id: 1
        })
        .exec((err: NativeError, productos: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos' })
            res.json(productos);
        })
}
export let buscarProductoPorTam = (req: Request, res: Response) => {
    Producto.find({ ancho: parseInt(req.params.ancho, 10), alto: parseInt(req.params.alto, 10) })
        .exec((err: NativeError, productos: IProducto[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un problema intentando obtener los productos' });
            return res.json(productos);
        });
}
export let buscarProducto = (req: Request, res: Response) => {
    const { b_n, c_r, familia, num_fotos } = req.body;
    Producto.aggregate()
        .lookup({
            from: 'familias',
            localField: 'familia',
            foreignField: '_id',
            as: 'familia'
        })
        .match({
            'familia.nombre': familia,
            b_n,
            c_r,
            num_fotos
        })
        .project('-familia')
        .exec((err: NativeError, productos: any[]) => {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un problema en el servidor' });
            }
            if (productos.length > 0) {
                return res.json(productos);
            } else {
                return res.status(422).send({ titulo: 'Error', detalles: 'No existe un producto con estas especificaciones' });
            }
        })
}
export let guardarProducto = (req: Request, res: Response) => {
    const producto = new Producto(req.body);
    producto.save((err: NativeError, guardado: IProducto) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
        } else {
            Familia.findOneAndUpdate({ _id: req.body.familia._id }, {
                $push: {
                    productos: guardado
                }
            })
                .exec((err: NativeError, actualizada: any) => {
                    if (err) {
                        return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
                    }
                    console.log(actualizada);
                })
            return res.json(guardado);
        }
    })
}
export let actualizarFotoProducto = (req: Request, res: Response) => {
    var foto = req.file.path.split('\\', 2)[1];
    Producto.findOneAndUpdate(
        { _id: req.params.idProducto },
        { foto },
        { new: true })
        .exec((err: NativeError, productoActualizado: IProducto | null) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al subir la imagen, por favor intentalo de nuevo' });
            if (!productoActualizado) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al subir la imagen, por favor intentalo de nuevo' });
            else return res.status(200).json({ foto: productoActualizado.foto });
        });
}
export let restaurarProducto = (req: Request, res: Response) => {
    Producto.findOneAndUpdate({ _id: req.params.idProducto }, {
        activo: 1
    }).exec((err: NativeError, eliminado: IProducto) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
        return res.json(eliminado);
    })
}