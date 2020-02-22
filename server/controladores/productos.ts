import { Request, Response } from 'express';
import { Familia, IFamilia } from '../modelos/familia.model';
import { NativeError } from 'mongoose';
import { Producto, IProducto } from '../modelos/producto.model';

export let obtenerFamilias = (req: Request, res: Response) => {
    Familia.find({ activa: 1 })
        .exec((err: NativeError, familias: IFamilia[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar las familias' });
            return res.json(familias);
        })
}
export let obtenerProductos = (req: Request, res: Response) => {
    Producto.find({ familia: req.params.id, activo: 1 })
        .exec((err: NativeError, productosEncontrados: IProducto[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los productos de la familia' });
            return res.json(productosEncontrados);
        })
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
            "familia.nombre": req.params.nombre,
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
            "familia.nombre": req.params.nombre,
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
            b_n: b_n,
            c_r: c_r,
            num_fotos: num_fotos
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