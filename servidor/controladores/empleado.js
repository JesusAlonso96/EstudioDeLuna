const Usuario = require('../modelos/usuario'),
    mongoose = require('mongoose'),
    Pedido = require('../modelos/pedido'),
    Venta = require('../modelos/venta'),
    Caja = require('../modelos/caja'),
    Notificacion = require('../modelos/notificacion'),
    momento = require('moment'),
    Cliente = require('../modelos/cliente');

exports.asignarFotografo = function (req, res) {
    var fecha = new Date(req.params.fecha);
    Usuario.aggregate()
        .lookup({
            from: "asistencias",
            localField: "asistencia",
            foreignField: "_id",
            as: "asistencia"
        })
        .match({
            "asistencia.asistencia": true,
            "asistencia.fecha": fecha,
            rol: 0,
            rol_sec: 1,
            ocupado: false
        })
        .project({
            _id: 1,
            nombre: 1,
            ape_pat: 1,
            ape_mat: 1,
            ocupado: 1,
            pedidosTomados: 1
        })
        .exec(function (err, asistencia) {
            if (err) {
                return -1;
            }
            if (asistencia.length > 0) {
                return res.json(asistencia)
            } else {
                return res.status(422).send({ titulo: 'No hay ningun fotografo desocupado' })

            }
        })

}
//si ninguno esta desocupado se va asignar al que menos pedidos tenga
exports.numPedidosFotografo = function (req, res) {
    Usuario.aggregate()
        .unwind("pedidosTomados")
        .lookup({
            from: "pedidos",
            localField: "pedidosTomados",
            foreignField: "_id",
            as: "pedidosTomados"
        })
        .match({
            rol: 0,
            rol_sec: 1
        })
        .group({
            _id: "$pedidosTomados.fotografo",
            count: { $sum: 1 }
        })
        .project({
            _id: 1,
            count: 1
        })
        .sort({
            count: 'asc'
        })
        .exec(function (err, respuesta) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al asignar al fotografo' });
            }
            if (respuesta.length > 0) {
                return res.json(respuesta[0]._id[0]);
            } else {
                return res.status(422).send({ titulo: 'Sin fotografo', detalles: 'No hay ningun fotografo disponible' })
            }
        });
}
exports.tieneAsistenciaTrabajador = function (req, res) {
    var fecha = new Date(req.params.fecha);
    Usuario.aggregate()
        .unwind("asistencia")
        .lookup({
            from: "asistencias",
            localField: "asistencia",
            foreignField: "_id",
            as: "asistencia"
        })
        .match({
            "asistencia.asistencia": true,
            "asistencia.fecha": fecha,
            rol: 0,
            _id: mongoose.Types.ObjectId(req.params.id)
        })
        .project({
            _id: 0,
            nombre: 1,
            asistencia: 1

        })
        .exec(function (err, asistencia) {
            if (err) {
                return -1;
            }
            if (asistencia.length > 0) {
                return res.json({ titulo: 'Asistio' })
            } else {
                return res.json({ titulo: 'No asistio' })

            }
        });
}
exports.crearPedido = function (req, res) {
    if (req.body.fotografo._id == undefined) {
        req.body.fotografo = null;
    }
    let pedidoAlta = new Pedido(req.body);
    pedidoAlta.save(function (err, pedidoGuardado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear el pedido' });
        }
        if (pedidoAlta.fotografo) {
            Usuario.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    pedidosTomados: pedidoGuardado
                }
            }, function (err, ok) { if (err) { } })
        }
        if (pedidoAlta.cliente) {
            Cliente.findByIdAndUpdate(pedidoAlta.cliente, {
                $push: {
                    pedidos: pedidoAlta
                }
            }, function (err, ok) { if (err) { } })
        }
        Pedido.findById(pedidoGuardado._id)
            .populate('productos')
            .populate('cliente')
            .exec(function (err, pedidoEncontrado) {
                if (err) {
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el pedido' });
                }
                return res.json(pedidoEncontrado);
            });
    });
}
exports.crearFoto = function (req, res) {
    var path = req.file.path.split('\\', 2)[1];
    Pedido.updateOne({ _id: req.params.id }, {
        $set: {
            foto: path
        }
    }).exec(function (err, pedidoActualizado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo subir la foto' });
        }
        return res.json(pedidoActualizado);
    })
}
exports.realizarVenta = function (req, res) {
    var hora = new Date(Date.now());
    var fecha = new Date(Date.now());
    fecha = momento().format('YYYY-MM-DD');
    hora = momento().format('h:mm:ss a');
    const venta = new Venta({
        pedido: req.body,
        fecha: fecha,
        hora: hora,
        vendedor: res.locals.usuario._id
    })
    venta.save(function (err, exito) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
        }
        return res.json(exito);
    })
    actualizarCaja(req.params.cantidadACaja, req.params.metodoPago);
}
exports.obtenerPedidosPorEmpleado = function (req, res) {
    Usuario.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedidosTomados",
            foreignField: "_id",
            as: "pedidosTomados"
        })
        .unwind({
            path: "$pedidosTomados",
            preserveNullAndEmptyArrays: true
        })
        .lookup({
            from: "clientes",
            localField: "pedidosTomados.cliente",
            foreignField: "_id",
            as: "cliente"
        })
        .lookup({
            from: "productos",
            localField: "pedidosTomados.productos",
            foreignField: "_id",
            as: "productos"
        })
        .match({
            $and: [
                { _id: mongoose.Types.ObjectId(req.params.id) },
                {
                    $or: [
                        { "pedidosTomados.status": 'Vendido' },
                        { "pedidosTomados.status": 'Finalizado' }
                    ]
                }
            ]
        })
        .project(
            {
                _id: '$pedidosTomados._id',
                num_pedido: '$pedidosTomados.num_pedido',
                status: '$pedidosTomados.status',
                nombre_cliente: { $arrayElemAt: ['$cliente.nombre', 0] },
                ape_pat_cliente: { $arrayElemAt: ['$cliente.ape_pat', 0] },
                ape_mat_cliente: { $arrayElemAt: ['$cliente.ape_mat', 0] },
                fecha_creacion: '$pedidosTomados.fecha_creacion',
                fecha_entrega: '$pedidosTomados.fecha_entrega',
                comentarios: '$pedidosTomados.comentarios',
                total: '$pedidosTomados.total',
                anticipo: '$pedidosTomados.anticipo',
                foto: '$pedidosTomados.foto'
            })
        .group({
            _id: '$pedidosTomados._id',
            pedido: {
                $push: {
                    _id: '$_id',
                    num_pedido: '$num_pedido',
                    status: '$status',
                    fecha_creacion: '$fecha_creacion',
                    fecha_entrega: '$fecha_entrega',
                    comentarios: '$comentarios',
                    cliente: {
                        $concat: ['$nombre_cliente', ' ', '$ape_pat_cliente', ' ', '$ape_mat_cliente']
                    },
                    anticipo: '$anticipo',
                    total: '$total',
                    foto: '$foto'
                }
            },

        })
        .exec(function (err, pedidos) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
            }
            if (pedidos.length > 0) {
                return res.json(pedidos);
            } else {
                return res.status(422).send({ titulo: 'No existen pedidos', detalles: 'El usuario no cuenta con ningun pedido realizado' })
            }

        });
}
exports.obtenerNumPedidosPorEmpleado = function (req, res) {
    Usuario.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedidosTomados",
            foreignField: "_id",
            as: "pedidosTomados"
        })
        .unwind({
            path: "$pedidosTomados",
            preserveNullAndEmptyArrays: true
        })
        .match({
            $and: [
                { _id: mongoose.Types.ObjectId(res.locals.usuario._id) },
                {
                    $or: [
                        { "pedidosTomados.status": 'Vendido' },
                        { "pedidosTomados.status": 'Finalizado' }
                    ]
                }
            ]
        })
        .group({
            _id: null,
            contador: {
                $sum: 1
            }
        })
        .project(
            {
                _id: 0
            })
        .exec(function (err, pedidos) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
            }
            return res.json(pedidos);
        });
}
exports.obtenerPedidosEnProceso = function (req, res) {
    Usuario.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedidosTomados",
            foreignField: "_id",
            as: "pedidosTomados",
        })
        .unwind({
            path: "$pedidosTomados",
            preserveNullAndEmptyArrays: true
        })
        .lookup({
            from: "productos",
            localField: "pedidosTomados.productos",
            foreignField: "_id",
            as: "productos"
        })
        .lookup({
            from: "clientes",
            localField: "pedidosTomados.cliente",
            foreignField: "_id",
            as: "cliente"
        })
        .match({
            $and: [
                { _id: mongoose.Types.ObjectId(res.locals.usuario._id) },
                {
                    $or: [
                        { "pedidosTomados.status": 'En retoque' },
                        { "pedidosTomados.status": 'Imprimiendo' },
                        { "pedidosTomados.status": 'Poniendo adherible' },
                        { "pedidosTomados.status": 'Cortando fotografias' }
                    ]
                }
            ]
        })
        .project(
            {
                _id: '$pedidosTomados._id',
                num_pedido: '$pedidosTomados.num_pedido',
                foto: '$pedidosTomados.foto',
                status: '$pedidosTomados.status',
                nombre_cliente: { $arrayElemAt: ['$cliente.nombre', 0] },
                ape_pat_cliente: { $arrayElemAt: ['$cliente.ape_pat', 0] },
                ape_mat_cliente: { $arrayElemAt: ['$cliente.ape_mat', 0] },
                fecha_creacion: '$pedidosTomados.fecha_creacion',
                fecha_entrega: '$pedidosTomados.fecha_entrega',
                comentarios: '$pedidosTomados.comentarios',
                total: '$pedidosTomados.total',
                anticipo: '$pedidosTomados.anticipo',
                c_ad: '$pedidosTomados.c_adherible',
                c_retoque: '$pedidosTomados.c_retoque',
                comentarios: '$pedidosTomados.comentarios',
                productos: '$pedidosTomados.productos'
            })
        .group({
            _id: '$pedidosTomados._id',
            pedido: {
                $push: {
                    _id: '$_id',
                    num_pedido: '$num_pedido',
                    status: '$status',
                    fecha_creacion: '$fecha_creacion',
                    fecha_entrega: '$fecha_entrega',
                    cliente: {
                        $concat: ['$nombre_cliente', ' ', '$ape_pat_cliente', ' ', '$ape_mat_cliente']
                    },
                    anticipo: '$anticipo',
                    total: '$total',
                    foto: '$foto',
                    c_adherible: '$c_ad',
                    c_retoque: '$c_retoque',
                    comentarios: '$comentarios',
                    productos: '$productos'
                }
            },

        })
        .exec(function (err, pedidos) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
            }
            if (pedidos.length > 0) {
                return res.json(pedidos);
            } else {
                return res.status(422).send({ titulo: 'No existen pedidos', detalles: 'El usuario no cuenta con ningun pedido realizandose' })
            }

        });
}
exports.obtenerNumPedidosEnProceso = function (req, res) {
    Usuario.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedidosTomados",
            foreignField: "_id",
            as: "pedidosTomados",
        })
        .unwind({
            path: "$pedidosTomados",
            preserveNullAndEmptyArrays: true
        })
        .match({
            $and: [
                { _id: mongoose.Types.ObjectId(res.locals.usuario._id) },
                {
                    $or: [
                        { "pedidosTomados.status": 'En retoque' },
                        { "pedidosTomados.status": 'Imprimiendo' },
                        { "pedidosTomados.status": 'Poniendo adherible' },
                        { "pedidosTomados.status": 'Cortando fotografias' }
                    ]
                }
            ]
        })
        .group({
            _id: null,
            contador: {
                $sum: 1
            }
        })
        .project(
            {
                _id: 0
            })
        .exec(function (err, pedidos) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
            }
            return res.json(pedidos);
        });
}
exports.obtenerProductosPorPedido = function (req, res) {
    Pedido.findById(req.params.id)
        .populate('productos')
        .exec(function (err, pedidos) {
            return res.json(pedidos.productos);
        });
}
exports.obtenerFotografos = function (req, res) {
    Usuario.find({ rol: 0, rol_sec: 1 }).exec(function (err, fotografosEncontrados) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los fotografos' })
        }
        return res.json(fotografosEncontrados);
    })
}
exports.obtenerFotografo = function (req, res) {
    Usuario.findById(req.params.id).exec(function (err, fotografo) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se encontro al fotografo' })
        }
        return res.json(fotografo);
    });
}
exports.obtenerNotificaciones = function (req, res) {
    var fecha = new Date(req.params.fecha);
    Notificacion.find({ $or: [{ usuario: req.params.id }, { usuario: null }], fecha: fecha })
        .sort({ num_pedido: -1 })
        .exec(function (err, notificaciones) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a las notificaciones' })
            }
            return res.json(notificaciones);
        });
}
exports.obtenerPedidosEnCola = function (req, res) {
    Pedido.find({ fotografo: null })
        .populate('productos')
        .populate('cliente')
        .exec(function (err, pedidosEncontrados) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los pedidos' })
            }
            return res.json(pedidosEncontrados)
        });
}
exports.obtenerNumPedidosEnCola = function (req, res) {
    Pedido.find({ fotografo: null })
        .countDocuments()
        .exec(function (err, pedidosEncontrados) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los pedidos' })
            }
            return res.json(pedidosEncontrados);
        });
}
exports.tomarPedido = function (req, res) {
    Pedido.findOneAndUpdate({ _id: req.params.idPedido }, {
        fotografo: req.params.id,
        status: 'En retoque'

    }).exec(function (err, pedidoActualizado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
        }
        Usuario.updateOne({ _id: req.params.id }, {
            $push: {
                pedidosTomados: pedidoActualizado
            },
            $set: {
                ocupado: true,
            }
        }).exec(function (err, actualizado) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
            }
        })
        Pedido.find({ fotografo: null }).exec(function (err, pedidos) {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
            }
            io.emit('quitar-pedido-cola', pedidoActualizado)
            return res.json(pedidos);
        });
    });
}
exports.actualizarEstadoPedido = function (req, res) {
    Pedido.findOneAndUpdate({ _id: req.body._id }, {
        $set: {
            status: req.body.status
        }
    }).exec(function (err, pedidoActualizado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
        }
        Pedido.findById(pedidoActualizado._id).exec(function (err, pedido) {
            return res.json(pedido)
        });
    });
}
exports.actualizarAnticipoPedido = function (req, res) {
    Pedido.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            anticipo: req.params.anticipo
        }
    }).exec(function (err, pedidoActualizado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
        }
        Pedido.findById(pedidoActualizado._id).exec(function (err, pedido) {
            return res.json(pedido)
        });
    });
}
exports.eliminarNotificacion = function (req, res) {
    Notificacion.findById(req.params.id)
        .exec(function (err, notificacion) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
            if (notificacion) {
                Notificacion.deleteOne({ _id: req.params.id }).exec(function (err, eliminada) {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
                    return res.json({ titulo: 'Notificacion eliminada', detalles: 'Notificacion eliminada exitosamente' });
                });
            }
        });
}
exports.eliminarNotificacionPorPedido = function (req, res) {
    Notificacion.findOne({ num_pedido: req.params.num })
        .exec(function (err, notificacion) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
            if (notificacion) {
                Notificacion.deleteOne({ _id: req.params.id }).exec(function (err, eliminada) {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
                    return res.json({ titulo: 'Notificacion eliminada', detalles: 'Notificacion eliminada exitosamente' });
                });
            }
        });
}
exports.eliminarNotificaciones = function () {
    Notificacion.deleteMany({}).exec(function (err, eliminadas) { if (err) { } })
}
exports.actualizarOcupado = function (req, res) {
    Usuario.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            ocupado: false
        }
    }).exec(function (err, actualizado) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el estado del fotografo' })
        }
    });
}
exports.obtenerPedidos = function (req, res) {
    Pedido.find().exec(function (err, pedidos) {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener todos los pedidos' })
        }
        return res.json(pedidos);
    });
}
exports.actualizarCaja = function (req, res) {
    actualizarCaja(req.params.cantidadACaja, req.params.metodoPago)
}
exports.fotografoMiddleware = function (req, res) {
    //no es fotografo
    if (res.locals.usuario.rol !== 0 && res.locals.rol_sec !== 1) {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para crear un pedido' })

    }
}
exports.recepcionistaMiddleware = function (req, res, next) {
    //no es recepcionista
    if (res.locals.usuario.rol == 0 && res.locals.usuario.rol_sec == 2) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para crear un pedido' })

    }
}

//funciones
function actualizarCaja(cantidad, metodoPago) {
    let cantidadSuma = parseInt(cantidad)
    switch (metodoPago) {
        case 'efectivo':
            Caja.findOne().exec(function (err, caja) {
                if (err) {
                    console.log(err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                }
                let cajaCantidad = caja.cantidadTotal + cantidadSuma;
                let cajaEfectivo = caja.cantidadEfectivo + cantidadSuma;
                Caja.updateOne({ _id: caja._id }, { cantidadTotal: cajaCantidad, cantidadEfectivo: cajaEfectivo })
                    .exec(function (err, cajaActualizada) {
                        if (err) {
                            console.log(err)
                            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                        }
                    })
            })
            break;

        case 'tarjeta':
            Caja.findOne().exec(function (err, caja) {
                if (err) {
                    console.log(err)
                    return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                }
                let cajaCantidad = caja.cantidadTotal + cantidadSuma;
                let cajaTarjetas = caja.cantidadTarjetas + cantidadSuma;
                Caja.updateOne({ _id: caja._id }, { cantidadTotal: cajaCantidad, cantidadTarjetas: cajaTarjetas })
                    .exec(function (err, cajaActualizada) {
                        if (err) {
                            console.log(err)
                            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                        }
                    })
            })
            break;
    }
}