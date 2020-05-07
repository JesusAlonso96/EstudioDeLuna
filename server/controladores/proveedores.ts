import { Request, Response } from 'express';
import { Proveedor, IProveedor } from '../modelos/proveedor.model';
import { NativeError } from 'mongoose';
import * as FuncionesSockets from '../sockets/funciones-auxiliares-sockets';
import { ProductoProveedor, IProductoProveedor } from '../modelos/producto_proveedor.model';

export let nuevoProveedor = (req: Request, res: Response) => {
    const proveedor = new Proveedor(req.body);
    proveedor.save((err: NativeError, registrado: IProveedor) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar al proveedor' });
        FuncionesSockets.obtenerNuevoElementoAdminOSupervisor(registrado, res, 0);
        return res.json({ titulo: 'Proveedor registrado', detalles: 'El proveedor fue registrado exitosamente' });
    });
}

export let obtenerProveedores = (req: Request, res: Response) => {
    Proveedor.find()
        .where({ activo: 1 })
        .exec((err: NativeError, proveedores: IProveedor[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo obtener la lista de proveedores' });
            return res.json(proveedores);
        })
}

export let agregarProductoProveedor = (req: Request, res: Response) => {
    if (!req.body.proveedor) {
        return res.status(422).send({ titulo: 'Error', detalles: 'Debes elegir un proveedor' });
    }
    const producto = new ProductoProveedor(req.body);
    producto.save((err: NativeError, productoGuardado: IProductoProveedor) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el producto' });
        if (productoGuardado) {
            Proveedor.findByIdAndUpdate(productoGuardado.proveedor._id, {
                $push: {
                    productos: productoGuardado
                }
            })
                .exec((err: NativeError, proveedorActualizado: IProveedor) => {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el producto' });
                    if (proveedorActualizado) return res.json({ titulo: 'Producto guardado', detalles: 'Producto guardado exitosamente' });
                })
        }
    });
}

export let obtenerListaProveedores = (req: Request, res: Response) => {
    Proveedor.find({ activo: 1 }, { rfc: 0, email: 0, ciudad: 0, estado: 0, telefono: 0, direccion: 0, colonia: 0, cp: 0, num_ext: 0, num_int: 0, activo: 0, __v: 0 })
        .exec((err: NativeError, listaProveedores: IProveedor[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo obtener la lista de proveedores' });
            let lista = [];
            for (let proveedor of listaProveedores) {
                if (proveedor.productos.length > 0) {
                    lista.push(proveedor);
                }
            }
            return res.json(lista);
        });
}

export let obtenerProductosProveedor = (req: Request, res: Response) => {
    ProductoProveedor.find({ proveedor: req.params.id, activo: 1 })
        .exec((err: NativeError, productos: IProductoProveedor[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos' });
            return res.json(productos);
        });
}
export let editarProveedor = (req: Request, res: Response) => {
    Proveedor.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        rfc: req.body.rfc,
        email: req.body.email,
        ciudad: req.body.ciudad,
        estado: req.body.estado,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        colonia: req.body.colonia,
        cp: req.body.cp,
        num_ext: req.body.num_ext,
        num_int: req.body.num_int
    })
        .exec((err: any, proveedorActualizado: IProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar al proveedor' });
            Proveedor.findById(proveedorActualizado._id)
                .exec((err: NativeError, proveedor: IProveedor) => {
                    FuncionesSockets.obtenerNuevoElemento(proveedor, res, 5);
                    return res.json({ titulo: 'Datos actualizados', detalles: 'Datos del proveedor actualizados correctamente' });
                })
        });
}
export let eliminarProveedor = (req: Request, res: Response) => {
    Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err: any, eliminado: IProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar al proveedor' });
            FuncionesSockets.obtenerNuevoElemento(eliminado, res, 7);
            return res.json({ titulo: 'Proveedor eliminado', detalles: 'Proveedor eliminado exitosamente' });
        })
}
export let restaurarProveedor = (req: Request, res: Response) => {
    Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec((err: any, proveedorActualizado: IProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar al proveedor' });
            FuncionesSockets.obtenerNuevoElemento(proveedorActualizado, res, 4);
            FuncionesSockets.obtenerNuevoElemento(proveedorActualizado, res, 6);
            return res.json({ titulo: 'Proveedor restaurado', detalles: 'Proveedor eliminado restaurado correctamente' });
        })
}
export let obtenerProveedoresEliminados = (req: Request, res: Response) => {
    Proveedor.find({ activo: 0, sucursal: res.locals.usuario.sucursal })
        .exec((err: any, usuariosEncontrados: IProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los proveedores eliminados' });
            return res.json(usuariosEncontrados);
        });
}
export let eliminarProductoProveedor = (req: Request, res: Response) => {
    ProductoProveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err: any, eliminado: IProductoProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
            if (eliminado) {
                ProductoProveedor.find({ activo: 1, proveedor: req.body.proveedor })
                    .exec((err, productos) => {
                        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos actualizados' });
                        return res.json(productos);
                    })
            }
        });
}

export let obtenerProductosProveedorEliminados = (req: Request, res: Response) => {
    ProductoProveedor.find({ activo: 0 })
        .populate('proveedor')
        .exec((err: any, productos: IProductoProveedor[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos eliminados' });
            return res.json(productos);
        })
}
export let restaurarProductoProveedorEliminado = (req: Request, res: Response) => {
    ProductoProveedor.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec((err: any, actualizado: IProductoProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el producto' });
            if (actualizado) return res.json({ titulo: 'Producto restaurado', detalles: 'Producto restaurado exitosamente' });
        })
}