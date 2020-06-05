"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compra_model_1 = require("../modelos/compra.model");
exports.obtenerComprasSinRegistrar = (req, res) => {
    compra_model_1.Compra.aggregate()
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
        .exec((err, compras) => {
        console.log(compras);
        console.log(err);
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener las compras, intentalo de nuevo mas tarde' });
        return res.status(200).json(compras);
    });
};
