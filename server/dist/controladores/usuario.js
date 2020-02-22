"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
const environment_1 = require("../global/environment");
const asistencia_model_1 = require("../modelos/asistencia.model");
const datos_estudio_model_1 = require("../modelos/datos_estudio.model");
const familia_model_1 = require("../modelos/familia.model");
const pedido_model_1 = require("../modelos/pedido.model");
const pestana_model_1 = require("../modelos/pestana.model");
const producto_model_1 = require("../modelos/producto.model");
const proveedor_model_1 = require("../modelos/proveedor.model");
const usuario_model_1 = require("../modelos/usuario.model");
const venta_model_1 = require("../modelos/venta.model");
const producto_proveedor_model_1 = require("../modelos/producto_proveedor.model");
const empresa_cot_model_1 = require("../modelos/empresa_cot.model");
const cotizacion_model_1 = require("../modelos/cotizacion.model");
exports.login = (req, res) => {
    const { username, contrasena } = req.body;
    usuario_model_1.Usuario.findOne({ username })
        .exec((err, usuarioEncontrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al iniciar sesión, intentalo de nuevo mas tarde' });
        if (!usuarioEncontrado) {
            return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
        }
        else {
            if (usuarioEncontrado.activo == 0) {
                return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
            }
            if (verificarContrasena(contrasena, usuarioEncontrado.contrasena)) {
                const token = jsonwebtoken_1.default.sign({
                    id: usuarioEncontrado._id,
                    nombre: usuarioEncontrado.nombre,
                    rol: usuarioEncontrado.rol,
                    rol_sec: usuarioEncontrado.rol_sec
                }, environment_1.environment.SECRET, { expiresIn: '8h' });
                return res.json(token);
            }
            else {
                return res.status(422).send({ titulo: 'Datos incorrectos', detalles: 'Correo electronico o contraseña erroneos' });
            }
        }
    });
};
exports.obtenerPestanas = (req, res) => {
    pestana_model_1.Pestana.find({ rol: req.params.rol })
        .exec((err, pestanas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: `Error al obtener los módulos de ${req.params.rol}` });
        if (pestanas)
            return res.json(pestanas);
    });
};
exports.obtenerDatosEstudio = (req, res) => {
    datos_estudio_model_1.DatosEstudio.findOne()
        .exec((err, datos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los datos' });
        return res.json(datos);
    });
};
//posible error
exports.crearAsistencia = (req, res) => {
    let hoy = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    const asistencia = new asistencia_model_1.Asistencia({ fecha: hoy, asistencia: true });
    asistencia.save((err, creada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al crear la asistencia' });
        if (creada) {
            usuario_model_1.Usuario.updateOne({ _id: req.params.id }, {
                $push: { asistencia }
            })
                .exec((err, actualizado) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al crear la asistencia' });
                return res.json(actualizado);
            });
        }
    });
};
exports.obtenerUsuario = (req, res) => {
    usuario_model_1.Usuario.findById(req.params.id)
        .exec((err, usuarioEncontrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se encontro el usuario solicitado' });
        return res.json(usuarioEncontrado);
    });
};
exports.agregarProducto = (req, res) => {
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
exports.eliminarProducto = (req, res) => {
    producto_model_1.Producto.findOneAndUpdate({ _id: req.params.id }, {
        activo: 0
    }).exec((err, eliminado) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
        }
        return res.json(eliminado);
    });
};
exports.actualizarProducto = (req, res) => {
    producto_model_1.Producto.findOneAndUpdate({ _id: req.body._id }, {
        nombre: req.body.nombre,
        num_fotos: req.body.num_fotos,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        b_n: req.body.b_n,
        c_r: req.body.c_r,
        c_ad: req.body.c_ad,
        ancho: req.body.ancho,
        alto: req.body.alto,
        caracteristicas: req.body.caracteristicas
    })
        .exec((err, actualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el producto' });
        return res.json(actualizado);
    });
};
exports.agregarFamilia = (req, res) => {
    const familia = new familia_model_1.Familia(req.body);
    familia_model_1.Familia.findOne({ nombre: familia.nombre })
        .exec((err, familiaEncontrada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar la familia' });
        if (familiaEncontrada) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ya existe una familia con este nombre', tipo: 2 });
        }
        else {
            familia.save((err, guardada) => {
                if (err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar la familia' });
                return res.json(guardada);
            });
        }
    });
};
exports.eliminarFamilia = (req, res) => {
    familia_model_1.Familia.update({ _id: req.params.id }, {
        activa: 0
    })
        .exec((err, eliminada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar la familia' });
        return res.json(eliminada);
    });
};
exports.obtenerUsuarios = (req, res) => {
    usuario_model_1.Usuario.find({ activo: 1 }, { contrasena: 0 })
        .exec((err, usuariosEncontrados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los usuarios' });
        return res.json(usuariosEncontrados);
    });
};
exports.obtenerPedidosRealizados = (req, res) => {
    pedido_model_1.Pedido.find({ status: 'Finalizado' })
        .populate('productos')
        .populate('fotografo', '-pedidosTomados -asistencia -contrasena')
        .populate('cliente', '-contrasena -pedidos')
        .exec((err, pedidos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
        console.log("holaaaaaaaaaaaaaa", pedidos);
        return res.json(pedidos);
    });
};
exports.obtenerPedidosVendidos = (req, res) => {
    const filtro = Number(req.params.filtro);
    if (filtro == 1) {
        let fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
        pedidosVendidosDia(fecha, res);
    }
    else if (filtro == 2) {
        pedidosVendidos(res);
    }
};
exports.obtenerFotografos = (req, res) => {
    usuario_model_1.Usuario.find({ rol: 0, rol_sec: 1, activo: 1 })
        .exec((err, fotografos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los empleados' });
        return res.json(fotografos);
    });
};
exports.obtenerPedidosRealizadosPorFotografo = (req, res) => {
    pedido_model_1.Pedido.aggregate()
        .lookup({
        from: "usuarios",
        localField: "fotografo",
        foreignField: "_id",
        as: "fotografo"
    })
        .unwind('fotografo')
        .lookup({
        from: "clientes",
        localField: "cliente",
        foreignField: "_id",
        as: "cliente"
    })
        .unwind('cliente')
        .match({
        'fotografo._id': mongoose_1.Types.ObjectId(req.params.id),
        status: 'Finalizado',
    })
        .sort({
        num_pedido: 'asc'
    })
        .exec((err, pedidos) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
        return res.json(pedidos);
    });
};
exports.obtenerPedidosVendidosPorFotografo = (req, res) => {
    let fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    const filtro = Number(req.params.filtro);
    if (filtro == 1) {
        pedidosVendidosPorEmpleadoDia(fecha, res, req.params.id);
    }
    else if (filtro == 2) {
        pedidosVendidosPorEmpleado(res, req.params.id);
    }
};
exports.obtenerVentasConRetoquePorFotografo = (req, res) => {
    let fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    venta_model_1.Venta.aggregate()
        .lookup({
        from: "pedidos",
        localField: "pedido",
        foreignField: "_id",
        as: "pedido",
    })
        .unwind('pedido')
        .unwind('pedido.fotografo')
        .lookup({
        from: "usuarios",
        localField: "pedido.fotografo",
        foreignField: "_id",
        as: "pedido.fotografo",
    })
        .unwind('pedido.fotografo')
        .match({
        fecha,
        'pedido.c_retoque': true
    })
        .group({
        _id: '$pedido.fotografo',
        montoVendido: { $sum: '$pedido.total' },
        pedidos: { $sum: 1 }
    })
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
        return res.json(ventas);
    });
};
exports.desglosarVentasConRetoquePorFotografo = (req, res) => {
    let fecha = new Date(moment_1.default(Date.now()).format('YYYY-MM-DD'));
    venta_model_1.Venta.aggregate()
        .lookup({
        from: "pedidos",
        localField: "pedido",
        foreignField: "_id",
        as: "pedido",
    })
        .unwind('pedido')
        .unwind('pedido.fotografo')
        .unwind('pedido.productos')
        .lookup({
        from: "usuarios",
        localField: "pedido.fotografo",
        foreignField: "_id",
        as: "pedido.fotografo",
    })
        .unwind('pedido.fotografo')
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
        .match({
        fecha,
        'pedido.c_retoque': true,
        'pedido.fotografo._id': mongoose_1.Types.ObjectId(req.params.id)
    })
        .group({
        _id: '$pedido.productos.familia.nombre',
        montoVendido: { $sum: '$pedido.total' },
        pedidos: { $sum: 1 }
    })
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
        return res.json(ventas);
    });
};
/* Modulo proveedores */
exports.nuevoProveedor = (req, res) => {
    const proveedor = new proveedor_model_1.Proveedor(req.body);
    proveedor.save((err, registrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar al proveedor' });
        if (registrado)
            return res.json({ titulo: 'Proveedor registrado', detalles: 'El proveedor fue registrado exitosamente' });
    });
};
exports.obtenerProveedores = (req, res) => {
    proveedor_model_1.Proveedor.find({ activo: 1 })
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
/* Modulo cotizaciones */
exports.obtenerEmpresas = (req, res) => {
    empresa_cot_model_1.EmpresaCot.find({ activa: 1 })
        .exec((err, empresas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las empresas' });
        return res.json(empresas);
    });
};
exports.nuevaEmpresa = (req, res) => {
    const nuevaEmpresa = new empresa_cot_model_1.EmpresaCot(req.body);
    nuevaEmpresa.save((err, guardada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la empresa' });
        if (guardada)
            return res.json({ titulo: 'Empresa agregada', detalles: 'Empresa agregada exitosamente' });
    });
};
exports.eliminarEmpresa = (req, res) => {
    empresa_cot_model_1.EmpresaCot.findByIdAndUpdate(req.body._id, {
        activa: 0
    })
        .exec((err, eliminada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar la empresa' });
        if (eliminada)
            return res.json({ titulo: 'Empresa eliminada', detalles: 'Empresa eliminada exitosamente' });
    });
};
exports.editarEmpresa = (req, res) => {
    empresa_cot_model_1.EmpresaCot.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        contacto: req.body.contacto,
        telefono: req.body.telefono,
        email: req.body.email,
        activa: req.body.activa
    })
        .exec((err, actualizada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar la empresa' });
        if (actualizada)
            return res.json({ titulo: 'Empresa actualizada', detalles: 'Empresa actualizada exitosamente' });
    });
};
exports.nuevaCotizacion = (req, res) => {
    const cotizacion = new cotizacion_model_1.Cotizacion(req.body);
    cotizacion.save((err, guardada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la cotizacion' });
        if (guardada)
            return res.json({ titulo: 'Cotizacion guardada', detalles: 'Cotizacion guardada exitosamente' });
    });
};
exports.obtenerCotizaciones = (req, res) => {
    cotizacion_model_1.Cotizacion.find({}, { __v: 0 })
        .populate('productos.producto', '-activo -caracteristicas -__v -familia -c_ad -c_r -b_n -nombre -num_fotos')
        .populate('asesor', '-_id -__v -ape_mat -asistencia -ocupado -pedidosTomados -activo -username -contrasena -rol -rol_sec')
        .populate('empresa', '-_id -activa -__v')
        .populate('datos', '-_id -__v')
        .sort({ num_cotizacion: 'desc' })
        .exec((err, cotizaciones) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la cotizacion' });
        return res.json(cotizaciones);
    });
};
/* Middlewares */
exports.autenticacionMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const usuario = parseToken(token);
        usuario_model_1.Usuario.findById(usuario.id, (err, usuarioEncontrado) => {
            if (usuarioEncontrado) {
                res.locals.usuario = usuarioEncontrado;
                next();
            }
            else {
                return res.status(422).send({ titulo: 'No autorizado', detalles: 'Necesitar iniciar sesion para tener acceso' });
            }
        });
    }
};
exports.adminOSupervisorMiddleware = (req, res, next) => {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 1 && res.locals.usuario.rol_sec == 0)) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' });
    }
};
exports.adminOSupervisorORecepcionistaMiddleware = (req, res, next) => {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 1 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 0 && res.locals.usuario.rol_sec == 2)) {
        next();
    }
    else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' });
    }
};
/* Funciones auxiliares */
function parseToken(token) {
    return jsonwebtoken_1.default.verify(token.split(' ')[1], environment_1.environment.SECRET);
}
function verificarContrasena(contrasena, contrasenaModel) {
    return bcrypt.compareSync(contrasena, contrasenaModel);
}
function pedidosVendidosDia(fecha, res) {
    venta_model_1.Venta.find({ fecha })
        .populate({
        path: 'pedido',
        select: '-_id -status -__v',
        populate: [
            {
                path: 'fotografo',
                select: '-pedidosTomados -asistencia -ocupado -activo -contrasena -__v -email -telefono -rol -rol_sec'
            },
            {
                path: 'productos',
                select: '-_id -familia -__v -activo'
            },
            {
                path: 'cliente',
                select: '-pedidos -activo -contrasena -direccion -colonia -municipio -estado -cp -num_ext -num_int -__v -razonSocial -rfc'
            }
        ]
    })
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
        var pedidos = [];
        for (let i = 0; i < ventas.length; i++) {
            pedidos[i] = ventas[i].pedido;
        }
        return res.json(pedidos);
    });
}
function pedidosVendidos(res) {
    venta_model_1.Venta.find()
        .populate({
        path: 'pedido',
        select: '-_id -status -__v',
        populate: [
            {
                path: 'cliente',
                select: '-pedidos -activo -contrasena -direccion -colonia -municipio -estado -cp -num_ext -num_int -__v -razonSocial -rfc'
            },
            {
                path: 'fotografo',
                select: '-pedidosTomados -asistencia -ocupado -activo -contrasena -__v -email -telefono -rol -rol_sec'
            },
            {
                path: 'productos',
                select: '-_id -familia -__v -activo'
            }
        ]
    })
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
        var pedidos = [];
        for (let i = 0; i < ventas.length; i++) {
            pedidos[i] = ventas[i].pedido;
        }
        console.log("SOY LA PETICION", pedidos);
        return res.json(pedidos);
    });
}
function pedidosVendidosPorEmpleadoDia(fecha, res, id) {
    venta_model_1.Venta.aggregate()
        .lookup({
        from: "pedidos",
        localField: "pedido",
        foreignField: "_id",
        as: "pedido",
    })
        .unwind('pedido')
        .unwind('pedido.fotografo')
        .lookup({
        from: "usuarios",
        localField: "pedido.fotografo",
        foreignField: "_id",
        as: "pedido.fotografo",
    })
        .unwind('pedido.fotografo')
        .lookup({
        from: "productos",
        localField: "pedido.productos",
        foreignField: "_id",
        as: "pedido.productos",
    })
        .match({
        fecha,
        'pedido.fotografo._id': mongoose_1.Types.ObjectId(id)
    })
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
        let pedidos = [];
        for (let i = 0; i < ventas.length; i++) {
            pedidos[i] = ventas[i].pedido;
        }
        return res.json(pedidos);
    });
}
function pedidosVendidosPorEmpleado(res, id) {
    venta_model_1.Venta.aggregate()
        .lookup({
        from: "pedidos",
        localField: "pedido",
        foreignField: "_id",
        as: "pedido",
    })
        .unwind('pedido')
        .unwind('pedido.fotografo')
        .lookup({
        from: "usuarios",
        localField: "pedido.fotografo",
        foreignField: "_id",
        as: "pedido.fotografo",
    })
        .unwind('pedido.fotografo')
        .lookup({
        from: "productos",
        localField: "pedido.productos",
        foreignField: "_id",
        as: "pedido.productos",
    })
        .match({
        'pedido.fotografo._id': mongoose_1.Types.ObjectId(id)
    })
        .exec((err, ventas) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
        let pedidos = [];
        for (let i = 0; i < ventas.length; i++) {
            pedidos[i] = ventas[i].pedido;
        }
        return res.json(pedidos);
    });
}