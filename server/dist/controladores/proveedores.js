"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const proveedor_model_1 = require("../modelos/proveedor.model");
const FuncionesSockets = __importStar(require("../sockets/funciones-auxiliares-sockets"));
const producto_proveedor_model_1 = require("../modelos/producto_proveedor.model");
exports.nuevoProveedor = (req, res) => {
    const proveedor = new proveedor_model_1.Proveedor(req.body);
    proveedor.save((err, registrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar al proveedor' });
        FuncionesSockets.obtenerNuevoElementoAdminOSupervisor(registrado, res, 0);
        return res.json({ titulo: 'Proveedor registrado', detalles: 'El proveedor fue registrado exitosamente' });
    });
};
exports.obtenerProveedores = (req, res) => {
    proveedor_model_1.Proveedor.find()
        .where({ activo: 1 })
        .exec((err, proveedores) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo obtener la lista de proveedores' });
        return res.json(proveedores);
    });
};
exports.agregarProductoProveedor = (req, res) => {
    if (!req.body.proveedor) {
        return res.status(422).send({ titulo: 'Error', detalles: 'Debes elegir un proveedor' });
    }
    const producto = new producto_proveedor_model_1.ProductoProveedor(req.body);
    producto.save((err, productoGuardado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el producto' });
        if (productoGuardado) {
            proveedor_model_1.Proveedor.findByIdAndUpdate(productoGuardado.proveedor._id, {
                $push: {
                    productos: productoGuardado
                }
            })
                .exec((err, proveedorActualizado) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el producto' });
                if (proveedorActualizado)
                    return res.json({ titulo: 'Producto guardado', detalles: 'Producto guardado exitosamente' });
            });
        }
    });
};
exports.obtenerListaProveedores = (req, res) => {
    proveedor_model_1.Proveedor.find({ activo: 1 }, { rfc: 0, email: 0, ciudad: 0, estado: 0, telefono: 0, direccion: 0, colonia: 0, cp: 0, num_ext: 0, num_int: 0, activo: 0, __v: 0 })
        .exec((err, listaProveedores) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo obtener la lista de proveedores' });
        let lista = [];
        for (let proveedor of listaProveedores) {
            if (proveedor.productos.length > 0) {
                lista.push(proveedor);
            }
        }
        return res.json(lista);
    });
};
exports.obtenerProductosProveedor = (req, res) => {
    producto_proveedor_model_1.ProductoProveedor.find({ proveedor: req.params.id, activo: 1 })
        .exec((err, productos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos' });
        return res.json(productos);
    });
};
exports.editarProveedor = (req, res) => {
    proveedor_model_1.Proveedor.findByIdAndUpdate(req.body._id, {
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
        .exec((err, proveedorActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar al proveedor' });
        proveedor_model_1.Proveedor.findById(proveedorActualizado._id)
            .exec((err, proveedor) => {
            FuncionesSockets.obtenerNuevoElemento(proveedor, res, 5);
            return res.json({ titulo: 'Datos actualizados', detalles: 'Datos del proveedor actualizados correctamente' });
        });
    });
};
exports.eliminarProveedor = (req, res) => {
    proveedor_model_1.Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err, eliminado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar al proveedor' });
        FuncionesSockets.obtenerNuevoElemento(eliminado, res, 7);
        return res.json({ titulo: 'Proveedor eliminado', detalles: 'Proveedor eliminado exitosamente' });
    });
};
exports.restaurarProveedor = (req, res) => {
    proveedor_model_1.Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec((err, proveedorActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar al proveedor' });
        FuncionesSockets.obtenerNuevoElemento(proveedorActualizado, res, 4);
        FuncionesSockets.obtenerNuevoElemento(proveedorActualizado, res, 6);
        return res.json({ titulo: 'Proveedor restaurado', detalles: 'Proveedor eliminado restaurado correctamente' });
    });
};
exports.obtenerProveedoresEliminados = (req, res) => {
    proveedor_model_1.Proveedor.find({ activo: 0, sucursal: res.locals.usuario.sucursal })
        .exec((err, usuariosEncontrados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los proveedores eliminados' });
        return res.json(usuariosEncontrados);
    });
};
exports.eliminarProductoProveedor = (req, res) => {
    producto_proveedor_model_1.ProductoProveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err, eliminado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
        if (eliminado) {
            producto_proveedor_model_1.ProductoProveedor.find({ activo: 1, proveedor: req.body.proveedor })
                .exec((err, productos) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos actualizados' });
                return res.json(productos);
            });
        }
    });
};
exports.obtenerProductosProveedorEliminados = (req, res) => {
    producto_proveedor_model_1.ProductoProveedor.find({ activo: 0 })
        .populate('proveedor')
        .exec((err, productos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos eliminados' });
        return res.json(productos);
    });
};
exports.restaurarProductoProveedorEliminado = (req, res) => {
    producto_proveedor_model_1.ProductoProveedor.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec((err, actualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el producto' });
        if (actualizado)
            return res.json({ titulo: 'Producto restaurado', detalles: 'Producto restaurado exitosamente' });
    });
};
