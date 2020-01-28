const Usuario = require('../modelos/usuario'),
    Venta = require('../modelos/venta'),
    Producto = require('../modelos/producto'),
    Corte = require('../modelos/corte_caja'),
    Pedido = require('../modelos/pedido'),
    Proveedor = require('../modelos/proveedor'),
    Caja = require('../modelos/caja'),
    ProductoProveedor = require('../modelos/producto_proveedor'),
    momento = require('moment');

exports.altaUsuario = function (req, res) {
    const usuarioAlta = new Usuario(req.body);
    usuarioAlta.save(function (err, usuarioCreado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el usuario' });
        }
        return res.json({ titulo: 'Usuario guardado con exito', detalles: usuarioCreado });
    })
}
exports.obtenerVentasMes = function (req, res) {
    var fechaInicio = new Date(momento(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(momento(req.params.fechaFin).format('YYYY-MM-DD'));
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "productos",
        })
        .lookup({
            from: "clientes",
            localField: "pedido.cliente",
            foreignField: "_id",
            as: "cliente",
        })
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .project({
            _id: '$pedido._id',
            num_pedido: '$pedido.num_pedido',
            status: '$pedido.status',
            fecha_creacion: '$pedido.fecha_creacion',
            fecha_entrega: '$pedido.fecha_entrega',
            comentarios: '$pedido.comentarios',
            total: '$pedido.total',
            anticipo: '$pedido.anticipo',
            foto: '$pedido.foto',
            productos: '$productos',
            dia: '$fecha',
            hora: '$hora',
            nombre_cliente: { $arrayElemAt: ['$cliente.nombre', 0] },
            ape_pat_cliente: { $arrayElemAt: ['$cliente.ape_pat', 0] },
            ape_mat_cliente: { $arrayElemAt: ['$cliente.ape_mat', 0] }

        })
        .group({
            _id: null,
            montoTotal: { $sum: '$total' },
            ventas: {
                $push: {
                    pedido: {
                        _id: '$_id',
                        num_pedido: '$num_pedido',
                        status: '$status',
                        fecha_creacion: '$fecha_creacion',
                        fecha_entrega: '$fecha_entrega',
                        comentarios: '$comentarios',
                        anticipo: '$anticipo',
                        total: '$total',
                        foto: '$foto',
                        productos: '$productos',
                        cliente: {
                            $concat: ['$nombre_cliente', ' ', '$ape_pat_cliente', ' ', '$ape_mat_cliente']
                        },
                    },
                    fecha: '$dia',
                    hora: '$hora'
                }
            }
        })
        .exec(function (err, ventas) {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            if (ventas.length == 0) {
                return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas en este dia', tipo: 0 })
            }
            return res.json(ventas[0]);
        })
}
exports.obtenerVentasDia = function (req, res) {
    var fecha = new Date(Date.now());
    fecha = momento().format('YYYY-MM-DD');
    fecha2 = new Date(fecha);
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "productos",
        })
        .lookup({
            from: "clientes",
            localField: "pedido.cliente",
            foreignField: "_id",
            as: "cliente",
        })
        .match({
            fecha: fecha2
        })
        .project({
            _id: '$pedido._id',
            num_pedido: '$pedido.num_pedido',
            status: '$pedido.status',
            fecha_creacion: '$pedido.fecha_creacion',
            fecha_entrega: '$pedido.fecha_entrega',
            comentarios: '$pedido.comentarios',
            total: '$pedido.total',
            anticipo: '$pedido.anticipo',
            foto: '$pedido.foto',
            productos: '$productos',
            dia: '$fecha',
            hora: '$hora',
            nombre_cliente: { $arrayElemAt: ['$cliente.nombre', 0] },
            ape_pat_cliente: { $arrayElemAt: ['$cliente.ape_pat', 0] },
            ape_mat_cliente: { $arrayElemAt: ['$cliente.ape_mat', 0] }

        })
        .group({
            _id: null,
            montoTotal: { $sum: '$total' },
            ventas: {
                $push: {
                    pedido: {
                        _id: '$_id',
                        num_pedido: '$num_pedido',
                        status: '$status',
                        fecha_creacion: '$fecha_creacion',
                        fecha_entrega: '$fecha_entrega',
                        comentarios: '$comentarios',
                        anticipo: '$anticipo',
                        total: '$total',
                        foto: '$foto',
                        productos: '$productos',
                        cliente: {
                            $concat: ['$nombre_cliente', ' ', '$ape_pat_cliente', ' ', '$ape_mat_cliente']
                        },
                    },
                    fecha: '$dia',
                    hora: '$hora'
                }
            }
        })
        .exec(function (err, ventas) {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            if (ventas.length == 0) {
                return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas en este dia', tipo: 0 })
            }
            return res.json(ventas);
        })
}
exports.obtenerVentasRango = function (req, res) {
    var fechaInicio = new Date(momento(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(momento(req.params.fechaFin).format('YYYY-MM-DD'));
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "productos",
        })
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .group({
            _id: '$fecha',
            montoTotal: { $sum: '$pedido.total' },
            clientes: { $sum: 1 }
        })
        .sort({
            _id: 1
        })
        .exec(function (err, ventas) {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            if (ventas.length == 0) {
                return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 })
            }
            return res.json(ventas);
        })
}
exports.obtenerProductosRango = function (req, res) {
    var fechaInicio = new Date(momento(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(momento(req.params.fechaFin).format('YYYY-MM-DD'));
    Producto.aggregate()
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .group({
            _id: null,
            count: { $sum: 1 }
        })
        .exec(function (err, ventas) {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            if (ventas.length == 0) {
                return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 })
            }
            return res.json(ventas);
        })
}
exports.obtener10ProductosMasVendidos = function (req, res) {
    var fechaInicio = new Date(momento(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(momento(req.params.fechaFin).format('YYYY-MM-DD'));
    Venta.aggregate()
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .unwind('pedido.productos')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "pedido.productos",
        })
        .unwind('pedido.productos')
        .group({
            _id: '$pedido.productos',
            cantidad: { $sum: 1 }
        })
        .sort({
            cantidad: -1
        })
        .limit(15)
        .exec(function (err, ventas) {
            if (err) {
                return res.json(err);
            }
            if (ventas.length == 0) {
                return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 })
            }
            return res.json(ventas);
        })
}
exports.obtenerVentasPorFamilias = function (req, res) {
    var fechaInicio = new Date(momento(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(momento(req.params.fechaFin).format('YYYY-MM-DD'));
    Venta.aggregate()
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .unwind('pedido.productos')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "pedido.productos",
        })
        .unwind('pedido.productos')
        .lookup({
            from: "familias",
            localField: "pedido.productos.familia",
            foreignField: "_id",
            as: "pedido.productos.familia",
        })
        .unwind('pedido.productos.familia')
        .group({
            _id: '$pedido.productos.familia',
            cantidad: {
                $sum: '$pedido.productos.precio'
            },
        })
        .exec(function (err, ventas) {
            if (err) {
                return res.json(err);
            }
            if (ventas.length == 0) {
                return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 })
            }
            return res.json(ventas);
        })
}
//corte de caja
exports.existeCorte = function (req, res) {
    const fecha = new Date(momento(Date.now()).format('YYYY-MM-DD'));
    Corte.findOne({ fecha })
        .exec(function (err, corte) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo verificar la existencia del corte de caja', tipo: 2 })
            }
            if (corte) {
                return res.json({ encontrado: true });
            } else {
                return res.json({ encontrado: false });
            }
        })
}
exports.crearCorteCaja = function (req, res) {
    var fecha = new Date(Date.now());
    var hora = new Date(Date.now());
    fecha = momento().format('YYYY-MM-DD');
    hora = momento().format('h:mm:ss a');

    corte = new Corte({
        fecha,
        hora,
        usuario: res.locals.usuario,
        efectivoEsperado: req.body.efectivoEsperado,
        tarjetaEsperado: req.body.tarjetaEsperado,
        efectivoContado: req.body.efectivoContado,
        tarjetaContado: req.body.tarjetaContado,
        fondoEfectivo: req.body.fondoEfectivo,
        fondoTarjetas: req.body.fondoTarjetas
    });
    corte.save(function (err, guardado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el corte de caja', tipo: 2 })
        }
        return res.json(guardado);
    });
}
exports.obtenerCaja = function (req, res) {
    Caja.findOne()
        .exec(function (err, caja) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las cantidades', tipo: 2 })
            }
            return res.json(caja)
        })
}
exports.actualizarCaja = function (req, res) {
    Caja.findOneAndUpdate({}, {
        cantidadTotal: req.body.cantidadTotal,
        cantidadEfectivo: req.body.cantidadEfectivo,
        cantidadTarjetas: req.body.cantidadTarjetas
    })
        .exec(function (err, cajaActualizada) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar la caja', tipo: 2 })
            }
            return res.json(cajaActualizada);
        })
}
exports.obtenerCortesCaja = function (req, res) {
    Corte.find()
        .sort({
            num_corte: 'desc'
        })
        .exec(function (err, cortes) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener el historial', tipo: 2 })
            }
            return res.json(cortes);
        })
}
exports.cambiarPermisos = function (req, res) {
    Usuario.findByIdAndUpdate(req.body._id, {
        rol: req.body.rol,
        rol_sec: req.body.rol_sec
    })
        .exec(function (err, actualizado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cambiar los permisos del usuario' });
            return res.json({ titulo: 'Permisos cambiados', detalles: 'Permisos cambiados exitosamente' });
        })
}
exports.obtenerUsuariosEliminados = function (req, res) {
    Usuario.find({ activo: 0 })
        .exec(function (err, usuariosEncontrados) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los usuarios eliminados' });
            return res.json(usuariosEncontrados);
        });
}
exports.restaurarUsuarioEliminado = function (req, res) {
    Usuario.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec(function (err, usuarioRestaurado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el usuario' });
            return res.json({ titulo: 'Usuario restaurado', detalles: 'Usuario restaurado exitosmente' });
        })
}
//Usuarios
exports.registrarUsuario = function (req, res) {
    const usuario = new Usuario(req.body);
    Usuario.findOne({ username: req.body.username })
        .exec(function (err, usuarioEncontrado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
            if (usuarioEncontrado) {
                return res.status(422).send({ titulo: 'Nombre de usuario repetido', detalles: 'Ya existe un usuario registrado' });
            } else {
                usuario.save(function (err, usuarioRegistrado) {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
                    return res.json({ titulo: 'Usuario registrado', detalles: 'Registro completado exitosamente' });
                })
            }
        })

}
exports.eliminarUsuario = function (req, res) {
    Usuario.findByIdAndUpdate(req.params.id, {
        activo: 0
    })
        .exec(function (err, usuarioEliminado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el usuario' });
            return res.json({ titulo: 'Usuario elimnado', detalles: 'Usuario eliminado exitosamente' });
        })
}
exports.editarUsuario = function (req, res) {
    Usuario.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        ape_pat: req.body.ape_pat,
        ape_mat: req.body.ape_mat,
        username: req.body.username,
        email: req.body.email,
        telefono: req.body.telefono
    })
        .exec(function (err, actualizado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el usuario' });
            return res.json({ titulo: 'Usuario actualizado', detalles: 'Los datos fueron actualizados correctamente' });
        })
}
//Proveedores
exports.editarProveedor = function (req, res) {
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
        .exec(function (err, proveedorActualizado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar al proveedor' });
            return res.json({ titulo: 'Datos actualizados', detalles: 'Datos del proveedor actualizados correctamente' });
        })
}
exports.eliminarProveedor = function (req, res) {
    Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec(function (err, eliminado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar al proveedor' });
            return res.json({ titulo: 'Proveedor eliminado', detalles: 'Proveedor eliminado exitosamente' });
        })
}
exports.restaurarProveedor = function (req, res) {
    Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec(function (err, proveedorActualizado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar al proveedor' });
            return res.json({ titulo: 'Proveedor restaurado', detalles: 'Proveedor eliminado restaurado correctamente' });
        })
}
exports.obtenerProveedoresEliminados = function (req, res) {
    Proveedor.find({ activo: 0 })
        .exec(function (err, usuariosEncontrados) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los proveedores eliminados' });
            return res.json(usuariosEncontrados);
        });
}
exports.eliminarProductoProveedor = function (req, res) {
    ProductoProveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec(function (err, eliminado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
            if (eliminado) {
                ProductoProveedor.find({ activo: 1, proveedor: req.body.proveedor })
                    .exec(function (err, productos) {
                        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos actualizados' });
                        return res.json(productos);
                    })
            }
        })
}
exports.editarProductoProveedor = function (req, res) {
    ProductoProveedor.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        costo: req.body.costo,
        detalles: req.body.detalles
    })
        .exec(function (err, actualizado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el producto' });
            if (actualizado) {
                ProductoProveedor.find({ proveedor: req.body.proveedor })
                    .exec(function (err, productos) {
                        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos actualizados' });
                        return res.json(productos);
                    })
            }
        })
}
exports.obtenerProductosProveedorEliminados = function (req, res) {
    ProductoProveedor.find({ activo: 0 })
        .populate('proveedor')
        .exec(function (err, productos) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos eliminados' });
            return res.json(productos);
        })
}
exports.restaurarProductoProveedorEliminado = function(req,res){
    ProductoProveedor.findByIdAndUpdate(req.body._id, {
        activo:1
    })
    .exec(function(err,actualizado){
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el producto' });
        if (actualizado) return res.json({titulo:'Producto restaurado', detalles:'Producto restaurado exitosamente'})
    })
}
//Middleware
exports.adminMiddleware = function (req, res, next) {
    if (res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })

    }
}