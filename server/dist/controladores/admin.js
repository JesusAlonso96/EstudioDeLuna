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
const mongoose_1 = require("mongoose");
const caja_model_1 = require("../modelos/caja.model");
const empresa_cot_model_1 = require("../modelos/empresa_cot.model");
const familia_model_1 = require("../modelos/familia.model");
const producto_model_1 = require("../modelos/producto.model");
const usuario_model_1 = require("../modelos/usuario.model");
const venta_model_1 = require("../modelos/venta.model");
const FuncionesSockets = __importStar(require("../sockets/funciones-auxiliares-sockets"));
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
        FuncionesSockets.obtenerNuevoElemento(usuarioCreado, res, 0);
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
        FuncionesSockets.obtenerNuevoElemento(usuarioRestaurado, res, 0);
        FuncionesSockets.obtenerNuevoElemento(usuarioRestaurado, res, 3);
        return res.json({ titulo: 'Usuario restaurado', detalles: 'Usuario restaurado exitosmente' });
    });
};
exports.registrarUsuario = (req, res) => {
    const usuario = new usuario_model_1.Usuario(req.body);
    usuario.sucursal = res.locals.usuario.sucursal;
    usuario.configuracion = {
        notificaciones: {
            botonCerrar: true,
            tiempo: 2000,
            posicion: 'toast-top-right',
            barraProgreso: false
        },
        tema: 'default'
    };
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
                FuncionesSockets.obtenerNuevoElemento(usuarioRegistrado, res, 0);
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
        FuncionesSockets.obtenerNuevoElemento(usuarioEliminado, res, 1);
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
            FuncionesSockets.obtenerNuevoElemento(usuario, res, 2);
            return res.json({ titulo: 'Usuario actualizado', detalles: 'Los datos fueron actualizados correctamente' });
        });
    });
};
/* Modulo proveedores */
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
        FuncionesSockets.obtenerNuevoElemento(restaurada, res, 8);
        FuncionesSockets.obtenerNuevoElemento(restaurada, res, 9);
        return res.json({ titulo: 'Familia restaurada', detalles: 'Familia restaurada exitosamente' });
    });
};
