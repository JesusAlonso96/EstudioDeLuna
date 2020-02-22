"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const caja_model_1 = require("../modelos/caja.model");
const corte_caja_model_1 = require("../modelos/corte_caja.model");
const empresa_cot_model_1 = require("../modelos/empresa_cot.model");
const producto_model_1 = require("../modelos/producto.model");
const producto_proveedor_model_1 = require("../modelos/producto_proveedor.model");
const proveedor_model_1 = require("../modelos/proveedor.model");
const usuario_model_1 = require("../modelos/usuario.model");
const venta_model_1 = require("../modelos/venta.model");
exports.altaUsuario = (req, res) => {
    const usuarioAlta = new usuario_model_1.Usuario(req.body);
    usuarioAlta.save((err, usuarioCreado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el usuario' });
        return res.json({ titulo: 'Usuario guardado con exito', detalles: usuarioCreado });
    });
};
exports.obtenerVentasMes = (req, res) => {
    var fechaInicio = new Date(moment_1.default(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment_1.default(req.params.fechaFin).format('YYYY-MM-DD'));
    venta_model_1.Venta.aggregate()
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
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las ventas del mes' });
        if (ventas.length == 0)
            return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas en este dia', tipo: 0 });
        return res.json(ventas[0]);
    });
};
//posible error
exports.obtenerVentasDia = (req, res) => {
    const fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    const fecha2 = new Date(fecha);
    venta_model_1.Venta.aggregate()
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
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las ventas del dia' });
        if (ventas.length == 0) {
            return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas en este dia', tipo: 0 });
        }
        else {
            return res.json(ventas);
        }
    });
};
exports.obtenerVentasRango = (req, res) => {
    var fechaInicio = new Date(moment_1.default(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment_1.default(req.params.fechaFin).format('YYYY-MM-DD'));
    venta_model_1.Venta.aggregate()
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
        .exec((err, ventas) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las ventas', tipo: 0 });
        }
        else if (ventas.length == 0) {
            return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 });
        }
        else {
            return res.json(ventas);
        }
    });
};
exports.obtenerProductosRango = (req, res) => {
    var fechaInicio = new Date(moment_1.default(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment_1.default(req.params.fechaFin).format('YYYY-MM-DD'));
    producto_model_1.Producto.aggregate()
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
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las ventas', tipo: 0 });
        if (ventas.length == 0)
            return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 });
        return res.json(ventas);
    });
};
exports.obtener10ProductosMasVendidos = (req, res) => {
    var fechaInicio = new Date(moment_1.default(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment_1.default(req.params.fechaFin).format('YYYY-MM-DD'));
    venta_model_1.Venta.aggregate()
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
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las ventas' });
        if (ventas.length == 0)
            return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 });
        return res.json(ventas);
    });
};
exports.obtenerVentasPorFamilias = (req, res) => {
    var fechaInicio = new Date(moment_1.default(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment_1.default(req.params.fechaFin).format('YYYY-MM-DD'));
    venta_model_1.Venta.aggregate()
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
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las ventas' });
        if (ventas.length == 0)
            return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 });
        return res.json(ventas);
    });
};
/* Corte de caja */
exports.existeCorte = (req, res) => {
    const fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    corte_caja_model_1.CorteCaja.findOne({ fecha })
        .exec((err, corte) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo verificar la existencia del corte de caja', tipo: 2 });
        if (corte) {
            return res.json({ encontrado: true });
        }
        else {
            return res.json({ encontrado: false });
        }
    });
};
//posible error
exports.crearCorteCaja = (req, res) => {
    var fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    var hora = new Date(moment_1.default(Date.now()).format('h:mm:ss a'));
    const corte = new corte_caja_model_1.CorteCaja({
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
    corte.save((err, guardado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el corte de caja', tipo: 2 });
        return res.json(guardado);
    });
};
exports.obtenerCaja = (req, res) => {
    caja_model_1.Caja.findOne()
        .exec((err, caja) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las cantidades', tipo: 2 });
        return res.json(caja);
    });
};
exports.actualizarCaja = (req, res) => {
    caja_model_1.Caja.findOneAndUpdate({}, {
        cantidadTotal: req.body.cantidadTotal,
        cantidadEfectivo: req.body.cantidadEfectivo,
        cantidadTarjetas: req.body.cantidadTarjetas
    })
        .exec((err, cajaActualizada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar la caja', tipo: 2 });
        return res.json(cajaActualizada);
    });
};
exports.obtenerCortesCaja = (req, res) => {
    corte_caja_model_1.CorteCaja.find()
        .sort({
        num_corte: 'desc'
    })
        .exec((err, cortes) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener el historial', tipo: 2 });
        return res.json(cortes);
    });
};
/* Modulo usuarios */
exports.cambiarPermisos = (req, res) => {
    usuario_model_1.Usuario.findByIdAndUpdate(req.body._id, {
        rol: req.body.rol,
        rol_sec: req.body.rol_sec
    })
        .exec((err, actualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cambiar los permisos del usuario' });
        return res.json({ titulo: 'Permisos cambiados', detalles: 'Permisos cambiados exitosamente' });
    });
};
exports.obtenerUsuariosEliminados = (req, res) => {
    usuario_model_1.Usuario.find({ activo: 0 })
        .exec((err, usuariosEncontrados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los usuarios eliminados' });
        return res.json(usuariosEncontrados);
    });
};
exports.restaurarUsuarioEliminado = (req, res) => {
    usuario_model_1.Usuario.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec((err, usuarioRestaurado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el usuario' });
        return res.json({ titulo: 'Usuario restaurado', detalles: 'Usuario restaurado exitosmente' });
    });
};
exports.registrarUsuario = (req, res) => {
    const usuario = new usuario_model_1.Usuario(req.body);
    usuario_model_1.Usuario.findOne({ username: req.body.username })
        .exec((err, usuarioEncontrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
        if (usuarioEncontrado) {
            return res.status(422).send({ titulo: 'Nombre de usuario repetido', detalles: 'Ya existe un usuario registrado' });
        }
        else {
            usuario.save((err, usuarioRegistrado) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
                return res.json({ titulo: 'Usuario registrado', detalles: 'Registro completado exitosamente' });
            });
        }
    });
};
exports.eliminarUsuario = (req, res) => {
    usuario_model_1.Usuario.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err, usuarioEliminado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el usuario' });
        return res.json({ titulo: 'Usuario elimnado', detalles: 'Usuario eliminado exitosamente' });
    });
};
exports.editarUsuario = (req, res) => {
    usuario_model_1.Usuario.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        ape_pat: req.body.ape_pat,
        ape_mat: req.body.ape_mat,
        username: req.body.username,
        email: req.body.email,
        telefono: req.body.telefono
    })
        .exec((err, actualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el usuario' });
        return res.json({ titulo: 'Usuario actualizado', detalles: 'Los datos fueron actualizados correctamente' });
    });
};
/* Modulo proveedores */
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
        return res.json({ titulo: 'Datos actualizados', detalles: 'Datos del proveedor actualizados correctamente' });
    });
};
exports.eliminarProveedor = (req, res) => {
    proveedor_model_1.Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err, eliminado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar al proveedor' });
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
        return res.json({ titulo: 'Proveedor restaurado', detalles: 'Proveedor eliminado restaurado correctamente' });
    });
};
exports.obtenerProveedoresEliminados = (req, res) => {
    proveedor_model_1.Proveedor.find({ activo: 0 })
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
exports.editarProductoProveedor = (req, res) => {
    producto_proveedor_model_1.ProductoProveedor.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        costo: req.body.costo,
        detalles: req.body.detalles
    })
        .exec((err, actualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el producto' });
        if (actualizado) {
            producto_proveedor_model_1.ProductoProveedor.find({ proveedor: req.body.proveedor })
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
/* Modulo cotizaciones */
exports.obtenerEmpresasEliminadas = (req, res) => {
    empresa_cot_model_1.EmpresaCot.find({ activa: 0 })
        .exec((err, empresasEliminadas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las empresas eliminadas' });
        if (empresasEliminadas)
            return res.json(empresasEliminadas);
    });
};
exports.restaurarEmpresaEliminada = (req, res) => {
    empresa_cot_model_1.EmpresaCot.findByIdAndUpdate(req.body._id, {
        activa: 1
    })
        .exec((err, restaurada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el producto' });
        if (restaurada)
            return res.json({ titulo: 'Empresa restaurada', detalles: 'Empresa restaurada exitosamente' });
    });
};
exports.adminMiddleware = (req, res, next) => {
    if (res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' });
    }
};