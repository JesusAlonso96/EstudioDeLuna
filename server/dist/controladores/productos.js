"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const familia_model_1 = require("../modelos/familia.model");
const mongoose_1 = require("mongoose");
const producto_model_1 = require("../modelos/producto.model");
exports.obtenerFamilias = (req, res) => {
    familia_model_1.Familia.find({ activa: 1, sucursal: res.locals.usuario.sucursal })
        .exec((err, familias) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar las familias' });
        return res.json(familias);
    });
};
exports.obtenerProductos = (req, res) => {
    producto_model_1.Producto.find({ familia: req.params.id, activo: 1 })
        .exec((err, productosEncontrados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los productos de la familia' });
        return res.json(productosEncontrados);
    });
};
exports.obtenerFamiliasYProductos = (req, res) => {
    familia_model_1.Familia.find({ activa: 1, sucursal: res.locals.usuario.sucursal })
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
        b_n: b_n,
        c_r: c_r,
        num_fotos: num_fotos
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
