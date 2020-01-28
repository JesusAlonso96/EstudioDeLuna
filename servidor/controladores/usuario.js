const Usuario = require('../modelos/usuario'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    Asistencia = require('../modelos/asistencia'),
    Pedido = require('../modelos/pedido'),
    Producto = require('../modelos/producto'),
    Familia = require('../modelos/familia'),
    Venta = require('../modelos/venta'),
    Proveedor = require('../modelos/proveedor'),
    ProductoProveedor = require('../modelos/producto_proveedor'),
    momento = require('moment'),
    config = require('../configuracion');

exports.login = function (req, res) {
    const { username, contrasena } = req.body;
    Usuario.findOne({ username: username }, function (err, usuarioEncontrado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Error desconocido, intentalo de nuevo mas tarde' });
        }
        if (!usuarioEncontrado) {
            return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
        } else {
            if (usuarioEncontrado.activo == 0) {
                return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
            }
            if (usuarioEncontrado.verificarContrasena(contrasena)) {
                const token = jwt.sign({
                    id: usuarioEncontrado._id,
                    nombre: usuarioEncontrado.nombre,
                    rol: usuarioEncontrado.rol,
                    rol_sec: usuarioEncontrado.rol_sec
                }, config.SECRET, { expiresIn: '8h' });
                return res.json(token);
            } else {
                return res.status(422).send({ titulo: 'Datos incorrectos', detalles: 'Correo electronico o contraseña erroneos' })
            }
        }
    })
}
exports.crearAsistencia = function (req, res) {
    var hoy = new Date();
    hoy = momento(hoy).format('YYYY-MM-DD');
    asistencia = new Asistencia({
        fecha: hoy,
        asistencia: true
    })
    asistencia.save();
    Usuario.updateOne({ _id: req.params.id }, {
        $push: {
            asistencia: asistencia
        }
    }).exec(function (err, exito) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la asistencia' });
        }
        return res.json(exito);
    })
}
exports.obtenerUsuario = function (req, res) {
    Usuario.findById(req.params.id).exec(function (err, usuarioEncontrado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se encontro el usuario solicitado' });
        }
        return res.json(usuarioEncontrado);

    })
}
exports.agregarProducto = function (req, res) {
    const producto = new Producto(req.body);
    producto.save(function (err, guardado) {
        if (err) {
            console.log(err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
        } else {
            Familia.findOneAndUpdate({ _id: req.body.familia._id }, {
                $push: {
                    productos: guardado
                }
            })
                .exec(function (err, actualizada) {
                    if (err) {
                        console.log(err)
                        return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar el producto' });
                    }
                    console.log(actualizada);
                })
            return res.json(guardado);
        }
    })
}
exports.eliminarProducto = function (req, res) {
    Producto.findOneAndUpdate({ _id: req.params.id }, {
        activo: 0
    }).exec(function (err, eliminado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
        }
        return res.json(eliminado)
    })
}
exports.actualizarProducto = function (req, res) {
    Producto.findOneAndUpdate({ _id: req.body._id }, {
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
        .exec(function (err, actualizado) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el producto' });
            }
            console.log(actualizado);
            return res.json(actualizado);
        })
}
exports.agregarFamilia = function (req, res) {
    const familia = new Familia(req.body);
    Familia.findOne({ nombre: familia.nombre })
        .exec(function (err, familiaEncontrada) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar la familia' });
            }
            else if (familiaEncontrada) {
                return res.status(422).send({ titulo: '', detalles: 'Ya existe una familia con este nombre', tipo: 2 })
            }
            else {
                familia.save(function (err, guardado) {
                    if (err) {
                        console.log(err)
                        return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar la familia' });
                    }
                    return res.json(guardado);
                })
            }
        })
}
exports.eliminarFamilia = function (req, res) {
    Familia.update({ _id: req.params.id }, {
        activa: 0
    }).exec(function (err, eliminada) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar la familia' })
        }
        return res.json(eliminada);
    })
}
exports.obtenerUsuarios = function (req, res) {
    Usuario.find({ activo: 1 }, { contrasena: 0 })
        .exec(function (err, usuariosEncontrados) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los usuarios' });
            return res.json(usuariosEncontrados);
        })
}
exports.obtenerPedidosRealizados = function (req, res) {
    Pedido.find({ status: 'Finalizado' })
        .populate('productos')
        .populate('fotografo', '-pedidosTomados -asistencia -contrasena')
        .populate('cliente', '-contrasena -pedidos')
        .exec(function (err, pedidos) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            return res.json(pedidos);
        })
}
exports.obtenerPedidosVendidos = function (req, res) {
    if (req.params.filtro == 1) {
        var fecha = new Date(Date.now());
        fecha = momento().format('YYYY-MM-DD')
        fecha2 = new Date(fecha);
        pedidosVendidosDia(fecha2, res);
    } else if (req.params.filtro == 2) {
        pedidosVendidos(res);
    }
}
exports.obtenerFotografos = function (req, res) {
    Usuario.find({ rol: 0, rol_sec: 1, activo: 1 })
        .exec(function (err, fotografos) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los empleados' });
            return res.json(fotografos);
        })
}
exports.obtenerPedidosRealizadosPorFotografo = function (req, res) {
    Pedido.aggregate()
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
            'fotografo._id': mongoose.Types.ObjectId(req.params.id),
            status: 'Finalizado',
        })
        .sort({
            num_pedido: 'asc'
        })
        .exec(function (err, pedidos) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            return res.json(pedidos);
        })

}
exports.obtenerPedidosVendidosPorFotografo = function (req, res) {
    var fecha = new Date(Date.now());
    fecha = momento().format('YYYY-MM-DD')
    fecha2 = new Date(fecha);
    if (req.params.filtro == 1) {
        pedidosVendidosPorEmpleadoDia(fecha2, res, req.params.id);
    } else if (req.params.filtro == 2) {
        pedidosVendidosPorEmpleado(res, req.params.id);
    }
}
exports.obtenerVentasConRetoquePorFotografo = function (req, res) {
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
        .unwind('pedido.fotografo')
        .lookup({
            from: "usuarios",
            localField: "pedido.fotografo",
            foreignField: "_id",
            as: "pedido.fotografo",
        })
        .unwind('pedido.fotografo')
        .match({
            fecha: fecha2,
            'pedido.c_retoque': true
        })
        .group({
            _id: '$pedido.fotografo',
            montoVendido: { $sum: '$pedido.total' },
            pedidos: { $sum: 1 }
        })
        .exec(function (err, ventas) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            return res.json(ventas);
        })
}
exports.desglosarVentasConRetoquePorFotografo = function (req, res) {
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
            fecha: fecha2,
            'pedido.c_retoque': true,
            'pedido.fotografo._id': mongoose.Types.ObjectId(req.params.id)

        })
        .group({
            _id: '$pedido.productos.familia.nombre',
            montoVendido: { $sum: '$pedido.total' },
            pedidos: { $sum: 1 }
        })
        .exec(function (err, ventas) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            return res.json(ventas);
        })
}
//modulo proveedores
exports.nuevoProveedor = function (req, res) {
    const proveedor = new Proveedor(req.body);
    proveedor.save(function (err, registrado) {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar al proveedor' });
        return res.json({ titulo: 'Proveedor registrado', detalles: 'El proveedor fue registrado exitosamente' });
    })
}
exports.obtenerProveedores = function (req, res) {
    Proveedor.find({ activo: 1 })
        .exec(function (err, proveedores) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo obtener la lista de proveedores' });
            return res.json(proveedores);
        })
}
exports.agregarProductoProveedor = function (req, res) {
    if (!req.body.proveedor) {
        return res.status(422).send({ titulo: 'Error', detalles: 'Debes elegir un proveedor' });
    }
    const producto = new ProductoProveedor(req.body);
    producto.save(function (err, productoGuardado) {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el producto' });
        if (productoGuardado) {
            Proveedor.findByIdAndUpdate(productoGuardado.proveedor._id, {
                $push: {
                    productos: productoGuardado
                }
            })
                .exec(function (err, proveedorActualizado) {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el producto' });
                    return res.json({ titulo: 'Producto guardado', detalles: 'Producto guardado exitosamente' });
                })
        }
    })
}
exports.obtenerListaProveedores = function (req, res) {
    Proveedor.find({ activo: 1 }, { rfc: 0, email: 0, ciudad: 0, estado: 0, telefono: 0, direccion: 0, colonia: 0, cp: 0, num_ext: 0, num_int: 0, activo: 0, __v: 0 })
        .exec(function (err, listaProveedores) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo obtener la lista de proveedores' });
            let lista = [];
            for (let proveedor of listaProveedores) {
                if (proveedor.productos.length > 0) {
                    lista.push(proveedor);
                }
            }
            return res.json(lista);
        })
}
exports.obtenerProductosProveedor = function (req, res) {
    ProductoProveedor.find({ proveedor: req.params.id, activo: 1 })
        .exec(function (err, productos) {
            if (err) {
                console.log(err);
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos' });
            }
            return res.json(productos);
        })
}

//middlewares
exports.autenticacionMiddleware = function (req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        const usuario = parseToken(token);
        Usuario.findById(usuario.id, function (err, usuarioEncontrado) {
            if (usuarioEncontrado) {
                res.locals.usuario = usuarioEncontrado;
                next();
            } else {
                return res.status(422).send({ titulo: 'No autorizado', detalles: 'Necesitar iniciar sesion para tener acceso' })
            }
        })
    }
}
exports.adminOSupervisorMiddleware = function (req, res, next) {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 1 && res.locals.usuario.rol_sec == 0)) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })

    }
}
exports.adminOSupervisorORecepcionistaMiddleware = function (req, res, next) {
    if ((res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 1 && res.locals.usuario.rol_sec == 0) || (res.locals.usuario.rol == 0 && res.locals.usuario.rol_sec == 2)) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })

    }
}
//funciones auxiliares
function parseToken(token) {
    return jwt.verify(token.split(' ')[1], config.SECRET);
}
function pedidosVendidosDia(fecha, res) {
    Venta.find({ fecha })
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
        .exec(function (err, ventas) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            var pedidos = [];
            for (let i = 0; i < ventas.length; i++) {
                pedidos[i] = ventas[i].pedido;
            }
            return res.json(pedidos);
        })
}
function pedidosVendidos(res) {
    Venta.find()
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
        .exec(function (err, ventas) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            var pedidos = [];
            for (let i = 0; i < ventas.length; i++) {
                pedidos[i] = ventas[i].pedido;
            }
            return res.json(pedidos);
        })
}
function pedidosVendidosPorEmpleadoDia(fecha, res, id) {
    Venta.aggregate()
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
            'pedido.fotografo._id': mongoose.Types.ObjectId(id)
        })
        .exec(function (err, ventas) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            let pedidos = [];
            for (let i = 0; i < ventas.length; i++) {
                pedidos[i] = ventas[i].pedido;
            }
            return res.json(pedidos);
        })
}
function pedidosVendidosPorEmpleado(res, id) {
    Venta.aggregate()
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
            'pedido.fotografo._id': mongoose.Types.ObjectId(id)
        })
        .exec(function (err, ventas) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            let pedidos = [];
            for (let i = 0; i < ventas.length; i++) {
                pedidos[i] = ventas[i].pedido;
            }
            return res.json(pedidos);
        })
}