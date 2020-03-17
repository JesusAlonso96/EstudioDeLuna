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
const servidor_1 = __importDefault(require("../clases/servidor"));
const environment_1 = require("../global/environment");
const asistencia_model_1 = require("../modelos/asistencia.model");
const cotizacion_model_1 = require("../modelos/cotizacion.model");
const datos_estudio_model_1 = require("../modelos/datos_estudio.model");
const empresa_cot_model_1 = require("../modelos/empresa_cot.model");
const familia_model_1 = require("../modelos/familia.model");
const pedido_model_1 = require("../modelos/pedido.model");
const pestana_model_1 = require("../modelos/pestana.model");
const producto_model_1 = require("../modelos/producto.model");
const producto_proveedor_model_1 = require("../modelos/producto_proveedor.model");
const proveedor_model_1 = require("../modelos/proveedor.model");
const usuario_model_1 = require("../modelos/usuario.model");
const venta_model_1 = require("../modelos/venta.model");
const Socket = __importStar(require("../sockets/socket"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const orden_compra_model_1 = require("../modelos/orden_compra.model");
const compra_model_1 = require("../modelos/compra.model");
const almacen_model_1 = require("../modelos/almacen.model");
const caja_model_1 = require("../modelos/caja.model");
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: 'j.alonso.jacl2@gmail.com',
        pass: 'papanatas.123'
    }
});
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
exports.generarCodigoRecuperacion = (req, res) => {
    const codigo = generarCodigo();
    const email = req.body.email;
    usuario_model_1.Usuario.findOne({ email }).exec((err, usuario) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al generar codigo', detalles: 'Ocurrio un error al generar el codigo de recuperacion de contrasena' });
        if (!usuario) {
            return res.status(422).send({ titulo: 'Error al generar codigo', detalles: 'No existe un usuario con este correo electronico' });
        }
    });
    usuario_model_1.Usuario.findOneAndUpdate({ email }, {
        codigoRecuperacion: codigo
    })
        .exec((err, actualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al generar codigo', detalles: 'Ocurrio un error al generar el codigo de recuperacion de contrasena' });
        if (actualizado) {
            let opciones = {
                from: '"Estudio de Luna" <j.alonso.jacl2@gmail.com>',
                to: email,
                subject: 'Recuperacion de contrasena',
                html: `<b>El codigo de recuperacion es ${codigo}</b>` // html body
            };
            transporter.sendMail(opciones, (err, info) => {
                if (err)
                    res.status(422).send({ titulo: 'Error al enviar correo', detalles: 'Ocurrio un error al enviar el correo electronico, por favor intentalo de nuevo mas tarde' });
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
                return res.json({ titulo: 'Correo enviado', detalles: 'Se ha enviado un correo para actualizar tu contrasena' });
            });
        }
    });
};
exports.recuperarContrasena = (req, res) => {
    const { contrasena, codigo } = req.body;
    usuario_model_1.Usuario.findOne({ email: req.params.email })
        .exec((err, usuarioEncontrado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Error al obtener datos del usuario, intentelo de nuevo mas tarde' });
        if (codigo !== usuarioEncontrado.codigoRecuperacion)
            return res.status(422).send({ titulo: 'Codigo erroneo', detalles: 'El codigo ingresado no coincide con el generado' });
        else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(contrasena, salt, function (err, hash) {
                    usuario_model_1.Usuario.findOneAndUpdate({ email: req.params.email }, {
                        $set: { contrasena: hash, codigoRecuperacion: '' }
                    })
                        .exec((err, usuarioActualizado) => {
                        if (err)
                            return res.status(422).send({ titulo: 'Error al actualizar contrasena', detalles: 'Ocurrio un error al actualizar la contrasena, intentalo de nuevo mas tarde' });
                        return res.status(200).send({ titulo: 'Contrasena actualizada', detalles: 'Se actualizo satisfactoriamente la contrasena' });
                    });
                });
            });
        }
    });
};
exports.eliminarCodigoRecuperacion = (req, res) => {
    usuario_model_1.Usuario.findOneAndUpdate({ email: req.body.email }, {
        codigoRecuperacion: ''
    })
        .exec((err, usuarioActualizado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Error al actualizar el codigo de recuperacion' });
        return res.status(200).json({ titulo: 'Codigo eliminado', detalles: 'El codigo de recuperacion ha sido eliminado' });
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
                obtenerNuevoElementoAdminOSupervisor(guardada, res, 2);
                return res.json(guardada);
            });
        }
    });
};
exports.eliminarFamilia = (req, res) => {
    familia_model_1.Familia.findByIdAndUpdate(req.params.id, {
        activa: 0
    })
        .exec((err, eliminada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar la familia' });
        obtenerNuevoElementoAdminOSupervisor(eliminada, res, 1);
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
        obtenerNuevoElementoAdminOSupervisor(registrado, res, 0);
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
/* Modulo de inventarios */
exports.obtenerOrdenesCompra = (req, res) => {
    orden_compra_model_1.OrdenCompra.find({ activa: true })
        .populate('usuario')
        .populate('proveedor')
        .populate('productosOrdenCompra.insumo')
        .exec((err, ordenes) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al obtener ordenes', detalles: 'Ocurrio un error al obtener las ordenes de compra, intentalo de nuevo mas tarde' });
        return res.status(200).json(ordenes);
    });
};
exports.nuevaOrdenCompra = (req, res) => {
    const orden = new orden_compra_model_1.OrdenCompra(req.body);
    orden.usuario = res.locals.usuario;
    orden.save((err, ordenGuardada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al crear orden', detalles: 'Ocurrio un error al crear la orden de compra, intentalo de nuevo mas tarde' });
        return res.status(200).json(ordenGuardada);
    });
};
exports.desactivarOrdenComra = (req, res) => {
    orden_compra_model_1.OrdenCompra.findByIdAndUpdate(req.params.id, {
        activa: false
    }).exec((err, ordenEliminada) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al actualizar orden de compra', detalles: 'Ocurrio un error al desactivar la orden de compra, intentalo de nuevo mas tarde' });
        return res.json(ordenEliminada);
    });
};
exports.registrarCompra = (req, res) => {
    const compra = new compra_model_1.Compra(req.body);
    almacen_model_1.Almacen.findById(compra.almacen._id)
        .populate('insumos.insumo')
        .exec((err, almacen) => {
        if (err)
            return res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
        if (almacen.insumos.length > 0) {
            for (let i = 0; i < compra.insumosCompra.length; i++) {
                const insumoEncontrado = almacen.insumos.find(insumo => mongoose_1.Types.ObjectId(insumo.insumo._id).equals(compra.insumosCompra[i].insumo._id));
                if (insumoEncontrado) {
                    const indice = almacen.insumos.indexOf(insumoEncontrado);
                    almacen.insumos[indice].existencia = almacen.insumos[indice].existencia + compra.insumosCompra[i].cantidad;
                }
                else {
                    almacen.insumos.push({
                        insumo: compra.insumosCompra[i].insumo,
                        existencia: compra.insumosCompra[i].cantidad
                    });
                }
            }
        }
        else {
            for (let i = 0; i < compra.insumosCompra.length; i++) {
                almacen.insumos.push({
                    insumo: compra.insumosCompra[i].insumo,
                    existencia: compra.insumosCompra[i].cantidad
                });
            }
        }
        almacen_model_1.Almacen.findByIdAndUpdate(almacen._id, {
            insumos: almacen.insumos
        }).exec((err, almacen) => {
            if (err) {
                console.log(err);
                return res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
            }
            const historialEgreso = {
                usuario: res.locals.usuario,
                tipo: 'Salida',
                descripcion: 'Se realizo una compra a proveedor',
                cantidadSalida: compra.total,
                cantidadEntrada: 0
            };
            caja_model_1.Caja.findOne().exec((err, caja) => {
                if (err) {
                    console.log(err);
                    return res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                }
                let cajaCantidad = 0;
                let cajaEfectivo = 0;
                let cajaTarjetas = 0;
                if (compra.metodoPago === 'Efectivo') {
                    if (compra.total > caja.cantidadEfectivo)
                        return res.status(422).send({ titulo: 'No se puede registrar la compra', detalles: 'No existen fondos suficientes en caja para realizar la compra' });
                    cajaCantidad = caja.cantidadTotal - compra.total;
                    cajaEfectivo = caja.cantidadEfectivo - compra.total;
                    cajaTarjetas = caja.cantidadTarjetas;
                }
                if (compra.metodoPago === 'Tarjeta') {
                    if (compra.total > caja.cantidadTarjetas)
                        return res.status(422).send({ titulo: 'No se puede registrar la compra', detalles: 'No existen fondos suficientes en caja para realizar la compra' });
                    cajaCantidad = caja.cantidadTotal - compra.total;
                    cajaTarjetas = caja.cantidadTarjetas - compra.total;
                    cajaEfectivo = caja.cantidadEfectivo;
                }
                caja_model_1.Caja.updateOne({ _id: caja._id }, {
                    cantidadTotal: cajaCantidad,
                    cantidadEfectivo: cajaEfectivo,
                    cantidadTarjetas: cajaTarjetas,
                    $push: {
                        historialEgresosIngresos: historialEgreso
                    }
                }).exec((err, actualizada) => {
                    if (err) {
                        console.log(err);
                        return res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                    }
                    if (!actualizada)
                        res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al actualizar la caja, intentalo de nuevo mas tarde' });
                    else {
                        for (let producto of compra.insumosCompra) {
                            producto_proveedor_model_1.ProductoProveedor.findByIdAndUpdate(producto.insumo._id, {
                                $push: {
                                    historialMov: {
                                        numFactura: compra.numFactura,
                                        usuario: res.locals.usuario,
                                        tipo: 'Ingreso',
                                        cantidadMovimiento: producto.cantidad
                                    }
                                }
                            }).exec((err, producto) => {
                                if (err)
                                    res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                                if (!producto)
                                    res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                            });
                        }
                        compra.usuario = res.locals.usuario;
                        compra.save((err, compra) => {
                            if (err)
                                res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                            return res.json(compra);
                        });
                    }
                });
            });
        });
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
function encriptarContrasena(contrasena) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(contrasena, salt, function (err, hash) {
            contrasena = hash;
        });
    });
}
exports.encriptarContrasena = encriptarContrasena;
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
function generarCodigo() {
    const tamCodigo = 8;
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < tamCodigo; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}
/* Funciones para sockets */
function obtenerNuevoElementoAdminOSupervisor(elemento, res, tipo) {
    const servidor = servidor_1.default.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) { //
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && ((usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0) || (usuarioConectado.rol == 1 && usuarioConectado.rol_sec == 0))) {
            switch (tipo) {
                case 0:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor', elemento);
                    break;
                case 1:
                    servidor.io.in(usuarioConectado.id).emit('nueva-familia-eliminada', elemento);
                    break;
                case 2:
                    servidor.io.in(usuarioConectado.id).emit('nueva-familia', elemento);
                    break;
            }
        }
    }
}
