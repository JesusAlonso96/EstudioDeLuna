"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const familia_model_1 = require("../modelos/familia.model");
const mongoose_1 = require("mongoose");
const producto_model_1 = require("../modelos/producto.model");
exports.obtenerFamilias = (req, res) => {
    familia_model_1.Familia.find({ activa: 1 })
        .exec((err, familias) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar las familias' });
        return res.json(familias);
    });
};
exports.obtenerProductos = (req, res) => {
    producto_model_1.Producto.find({ familia: req.params.idFamilia, activo: 1 })
        .exec((err, productosEncontrados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los productos de la familia' });
        return res.json(productosEncontrados);
    });
};
exports.obtenerProductosInactivos = (req, res) => {
};
exports.obtenerFamiliasYProductos = (req, res) => {
    familia_model_1.Familia.find({ activa: 1 })
        .populate({
        path: 'productos',
        match: { activo: 1 }
    })
        .sort({ nombre: 1 })
        .exec((err, familias) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un problema intentando obtener los productos' });
        res.json(familias);
    });
};
exports.obtenerFamiliasYProductosInactivos = (req, res) => {
    familia_model_1.Familia.find({ activa: 1 })
        .populate({
        path: 'productos',
        match: { activo: 0 }
    })
        .sort({ nombre: 1 })
        .exec((err, familias) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un problema intentando obtener los productos' });
        res.json(familias);
    });
};
exports.obtenerProductosPorTam = (req, res) => {
    producto_model_1.Producto
        .aggregate()
        .lookup({
        from: "familias",
        localField: "familia",
        foreignField: "_id",
        as: "familia"
    })
        .match({
        "familia._id": mongoose_1.Types.ObjectId(req.params.id),
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
        .exec((err, productos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos' });
        res.json(productos);
    });
};
exports.obtenerProductosPorCantidad = (req, res) => {
    producto_model_1.Producto
        .aggregate()
        .lookup({
        from: "familias",
        localField: "familia",
        foreignField: "_id",
        as: "familia"
    })
        .match({
        "familia._id": mongoose_1.Types.ObjectId(req.params.id),
        activo: 1
    })
        .group({
        _id: "$num_fotos"
    })
        .sort({
        _id: 1
    })
        .exec((err, productos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos' });
        res.json(productos);
    });
};
exports.buscarProductoPorTam = (req, res) => {
    producto_model_1.Producto.find({ ancho: parseInt(req.params.ancho, 10), alto: parseInt(req.params.alto, 10) })
        .exec((err, productos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un problema intentando obtener los productos' });
        return res.json(productos);
    });
};
exports.buscarProducto = (req, res) => {
    const { b_n, c_r, familia, num_fotos } = req.body;
    producto_model_1.Producto.aggregate()
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
        .exec((err, productos) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un problema en el servidor' });
        }
        if (productos.length > 0) {
            return res.json(productos);
        }
        else {
            return res.status(422).send({ titulo: 'Error', detalles: 'No existe un producto con estas especificaciones' });
        }
    });
};
exports.guardarProducto = (req, res) => {
    const producto = new producto_model_1.Producto(req.body);
    producto.save((err, guardado) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
        }
        else {
            familia_model_1.Familia.findOneAndUpdate({ _id: req.body.familia._id }, {
                $push: {
                    productos: guardado
                }
            })
                .exec((err, actualizada) => {
                if (err) {
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
                }
                console.log(actualizada);
            });
            return res.json(guardado);
        }
    });
};
exports.actualizarFotoProducto = (req, res) => {
    var foto = req.file.path.split('\\', 2)[1];
    producto_model_1.Producto.findOneAndUpdate({ _id: req.params.idProducto }, { foto }, { new: true })
        .exec((err, productoActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al subir la imagen, por favor intentalo de nuevo' });
        if (!productoActualizado)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al subir la imagen, por favor intentalo de nuevo' });
        else
            return res.status(200).json({ foto: productoActualizado.foto });
    });
};
exports.restaurarProducto = (req, res) => {
    producto_model_1.Producto.findOneAndUpdate({ _id: req.params.idProducto }, {
        activo: 1
    }).exec((err, eliminado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
        return res.json(eliminado);
    });
};
