"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const caja_model_1 = require("../modelos/caja.model");
const empresa_cot_model_1 = require("../modelos/empresa_cot.model");
const producto_model_1 = require("../modelos/producto.model");
const producto_proveedor_model_1 = require("../modelos/producto_proveedor.model");
const proveedor_model_1 = require("../modelos/proveedor.model");
const usuario_model_1 = require("../modelos/usuario.model");
const venta_model_1 = require("../modelos/venta.model");
const servidor_1 = __importDefault(require("../clases/servidor"));
const Socket = __importStar(require("../sockets/socket"));
const mongoose_1 = require("mongoose");
const familia_model_1 = require("../modelos/familia.model");
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
        sucursal: mongoose_1.Types.ObjectId(res.locals.usuario.sucursal),
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
        sucursal: mongoose_1.Types.ObjectId(res.locals.usuario.sucursal),
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
        sucursal: mongoose_1.Types.ObjectId(res.locals.usuario.sucursal),
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
        sucursal: mongoose_1.Types.ObjectId(res.locals.usuario.sucursal),
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
        sucursal: mongoose_1.Types.ObjectId(res.locals.usuario.sucursal),
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
        sucursal: mongoose_1.Types.ObjectId(res.locals.usuario.sucursal),
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
exports.obtenerCaja = (req, res) => {
    caja_model_1.Caja.findOne({ _id: req.params.id })
        .exec((err, caja) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las cantidades', tipo: 2 });
        return res.json(caja);
    });
};
/* Modulo usuarios */
exports.altaUsuario = (req, res) => {
    const usuarioAlta = new usuario_model_1.Usuario(req.body);
    usuarioAlta.sucursal = res.locals.usuario.sucursal;
    usuarioAlta.configuracion = {
        notificaciones: {
            botonCerrar: true,
            tiempo: 2000,
            posicion: 'toast-top-right',
            barraProgreso: false
        },
        tema: 'default'
    };
    usuarioAlta.save((err, usuarioCreado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el usuario' });
        obtenerNuevoElemento(usuarioCreado, res, 0);
        return res.json({ titulo: 'Usuario guardado con exito', detalles: usuarioCreado });
    });
};
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
    usuario_model_1.Usuario.find({ activo: 0, sucursal: res.locals.usuario.sucursal })
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
        obtenerNuevoElemento(usuarioRestaurado, res, 0);
        obtenerNuevoElemento(usuarioRestaurado, res, 3);
        return res.json({ titulo: 'Usuario restaurado', detalles: 'Usuario restaurado exitosmente' });
    });
};
exports.registrarUsuario = (req, res) => {
    const usuario = new usuario_model_1.Usuario(req.body);
    usuario.sucursal = res.locals.usuario.sucursal;
    usuario_model_1.Usuario.findOne({ username: req.body.username })
        .exec((err, usuarioEncontrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
        if (usuarioEncontrado)
            return res.status(422).send({ titulo: 'Nombre de usuario repetido', detalles: 'Ya existe un usuario registrado' });
        else {
            usuario.save((err, usuarioRegistrado) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
                obtenerNuevoElemento(usuarioRegistrado, res, 0);
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
        obtenerNuevoElemento(usuarioEliminado, res, 1);
        return res.json({ titulo: 'Usuario elimnado', detalles: 'Usuario eliminado exitosamente' });
    });
};
exports.editarUsuario = (req, res) => {
    const usuario = new usuario_model_1.Usuario(req.body);
    usuario_model_1.Usuario.findByIdAndUpdate(req.body._id, {
        nombre: usuario.nombre,
        ape_pat: usuario.ape_pat,
        ape_mat: usuario.ape_mat,
        username: usuario.username,
        email: usuario.email,
        telefono: usuario.telefono
    })
        .exec((err, usuarioActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el usuario' });
        usuario_model_1.Usuario.findById(usuarioActualizado._id)
            .exec((err, usuario) => {
            obtenerNuevoElemento(usuario, res, 2);
            return res.json({ titulo: 'Usuario actualizado', detalles: 'Los datos fueron actualizados correctamente' });
        });
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
        proveedor_model_1.Proveedor.findById(proveedorActualizado._id)
            .exec((err, proveedor) => {
            obtenerNuevoElemento(proveedor, res, 5);
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
        obtenerNuevoElemento(eliminado, res, 7);
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
        obtenerNuevoElemento(proveedorActualizado, res, 4);
        obtenerNuevoElemento(proveedorActualizado, res, 6);
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
    empresa_cot_model_1.EmpresaCot.find({ activa: 0, sucursal: res.locals.usuario.sucursal })
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
exports.obtenerFamiliasEliminadas = (req, res) => {
    familia_model_1.Familia.find({ activa: 0, sucursal: res.locals.usuario.sucursal })
        .exec((err, familias) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las familias eliminadas' });
        return res.json(familias);
    });
};
exports.restaurarFamiliaEliminada = (req, res) => {
    familia_model_1.Familia.findByIdAndUpdate(req.body._id, {
        activa: 1
    })
        .exec((err, restaurada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar la familia de productos' });
        obtenerNuevoElemento(restaurada, res, 8);
        obtenerNuevoElemento(restaurada, res, 9);
        return res.json({ titulo: 'Familia restaurada', detalles: 'Familia restaurada exitosamente' });
    });
};
/* Funciones para sockets */
function obtenerNuevoElemento(elemento, res, tipo) {
    const servidor = servidor_1.default.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0 && usuarioConectado.sucursal == res.locals.usuario.sucursal) {
            switch (tipo) {
                case 0:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-usuario', elemento);
                    break;
                case 1:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-eliminado', elemento);
                    break;
                case 2:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-editado', elemento);
                    break;
                case 3:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-restaurado', elemento);
                    break;
                case 4:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor', elemento);
                    break;
                case 5:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-editado', elemento);
                    break;
                case 6:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-restaurado', elemento);
                    break;
                case 7:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-eliminado', elemento);
                    break;
                case 8:
                    servidor.io.in(usuarioConectado.id).emit('nueva-familia', elemento);
                    break;
                case 9:
                    servidor.io.in(usuarioConectado.id).emit('nueva-familia-restaurada', elemento);
                    break;
            }
        }
    }
}
