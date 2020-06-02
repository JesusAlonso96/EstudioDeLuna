import { Request, Response } from 'express';
import { Usuario, IUsuario } from '../modelos/usuario.model';
import { Types, NativeError } from 'mongoose';
import moment from 'moment';
import { Pedido, IPedido } from '../modelos/pedido.model';
import nodemailer from 'nodemailer';
import { Cliente, ICliente } from '../modelos/cliente.model';
import { Notificacion, INotificacion } from '../modelos/notificacion.model';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: 'j.alonso.jacl2@gmail.com',
        pass: 'papanatas.1234'
    }
})

export let numPedidosFotografo = (req: Request, res: Response) => {
    Usuario.aggregate()
        .unwind("pedidosTomados")
        .lookup({
            from: "pedidos",
            localField: "pedidosTomados",
            foreignField: "_id",
            as: "pedidosTomados"
        })
        .match({
            sucursal: Types.ObjectId(res.locals.usuario.sucursal),
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
        .exec((err: NativeError, respuesta: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al asignar al fotografo' });
            if (respuesta.length > 0) {
                return res.json(respuesta[0]._id[0]);
            } else {
                return res.status(422).send({ titulo: 'Sin fotografo', detalles: 'No hay ningun fotografo disponible' })
            }
        });
}
export let obtenerPedidos = (req: Request, res: Response) => {
    let filtro: any = {};
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth();
    switch (Number(req.params.tipoFiltro)) {
        case 1:
            const dia = new Date(Date.now()).getDate();
            filtro = {
                fecha_creacion: {
                    $gte: new Date(anioActual, mesActual, dia, 0, 0, 0),
                    $lte: new Date(anioActual, mesActual, dia, 24, 0, 0)
                }
            }
            break;
        case 2:
            const diaActual = new Date().getDate()
            const inicioSemana = diaActual - new Date().getDay();
            filtro = {
                sucursal: res.locals.usuario.sucursal,
                fecha_creacion: {
                    $gte: new Date(anioActual, mesActual, inicioSemana),
                    $lte: new Date(anioActual, mesActual, inicioSemana + 7)
                }
            };
            break;
        case 3:
            const fechaInicio = new Date(anioActual, mesActual, 1);
            const fechaFin = new Date(anioActual, mesActual, moment(fechaInicio).daysInMonth())
            console.log("fecha de inicio del mes => ", fechaInicio, " fecha de fin del mes => ", fechaFin)
            filtro = {
                sucursal: res.locals.usuario.sucursal,
                fecha_creacion: {
                    $gte: fechaInicio,
                    $lte: fechaFin
                }
            }
            break;
        case 4:
            const mesInicio = mesActual - 2;
            const fechaInicioTresMeses = new Date(anioActual, mesInicio, 1);
            const fechaFinTresMeses = new Date(anioActual, mesActual, moment(new Date(anioActual, mesActual, 1)).daysInMonth());
            filtro = {
                sucursal: res.locals.usuario.sucursal,
                fecha_creacion: {
                    $gte: fechaInicioTresMeses,
                    $lte: fechaFinTresMeses
                }
            }
            break;
        default: filtro = {}; break;
    }
    Pedido.find()
        .where(filtro)
        .sort({ fecha_creacion: -1 })
        .exec((err: NativeError, pedidos: IPedido[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener todos los pedidos' })
            return res.json(pedidos);
        });
}
export let obtenerPedidosPorEmpleado = (req: Request, res: Response) => {
    let filtro: any = {};
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth();
    switch (Number(req.query.tipoFiltro)) {
        case 1:
            const dia = new Date(Date.now()).getDate();
            filtro = {
                fecha_creacion: {
                    $gte: new Date(anioActual, mesActual, dia, 0, 0, 0),
                    $lte: new Date(anioActual, mesActual, dia, 24, 0, 0)
                }
            }; break;
        case 2:
            const diaActual = new Date().getDate()
            const inicioSemana = diaActual - new Date().getDay();
            filtro = {
                fecha_creacion: {
                    $gte: new Date(anioActual, mesActual, inicioSemana),
                    $lte: new Date(anioActual, mesActual, inicioSemana + 7)
                }
            };
            break;
        case 3:
            const fechaInicio = new Date(anioActual, mesActual, 1);
            const fechaFin = new Date(anioActual, mesActual, moment(fechaInicio).daysInMonth())
            filtro = {
                fecha_creacion: {
                    $gte: fechaInicio,
                    $lte: fechaFin
                }
            }
            break;
        case 4:
            const mesInicio = mesActual - 2;
            const fechaInicioTresMeses = new Date(anioActual, mesInicio, 1);
            const fechaFinTresMeses = new Date(anioActual, mesActual, moment(new Date(anioActual, mesActual, 1)).daysInMonth());
            filtro = {
                fecha_creacion: {
                    $gte: fechaInicioTresMeses,
                    $lte: fechaFinTresMeses
                }
            }
            break;
        default: filtro = { fecha_creacion: null }; break;
    }
    if (filtro.fecha_creacion !== null) {
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
                _id: Types.ObjectId(req.params.id),
                $or: [{ "pedidosTomados.status": 'Vendido' }, { "pedidosTomados.status": 'Finalizado' }],
                "pedidosTomados.fecha_creacion": filtro.fecha_creacion
            })
            .project({
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
            .exec((err: NativeError, pedidos: any[]) => {
                if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
                if (pedidos.length > 0) {
                    return res.json(pedidos);
                } else {
                    return res.status(422).send({ titulo: 'No existen pedidos', detalles: 'El usuario no cuenta con ningun pedido realizado' })
                }

            });
    } else {
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
                _id: Types.ObjectId(req.params.id),
                $or: [{ "pedidosTomados.status": 'Vendido' }, { "pedidosTomados.status": 'Finalizado' }],
            })
            .project({
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
            .exec((err: NativeError, pedidos: any[]) => {
                if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
                console.log("entre")
                if (pedidos.length > 0) {
                    return res.json(pedidos);
                } else {
                    return res.status(422).send({ titulo: 'No existen pedidos', detalles: 'El usuario no cuenta con ningun pedido realizado' })
                }

            });
    }

}
export let obtenerNumPedidosPorEmpleado = (req: Request, res: Response) => {
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
                { _id: Types.ObjectId(res.locals.usuario._id) },
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
        .exec((err: NativeError, pedidos: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
            return res.json(pedidos);
        });
}
export let obtenerPedidosEnProceso = (req: Request, res: Response) => {
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
                { _id: Types.ObjectId(res.locals.usuario._id) },
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
        .exec((err: NativeError, pedidos: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
            if (pedidos.length > 0) {
                return res.json(pedidos);
            } else {
                return res.status(422).send({ titulo: 'No existen pedidos', detalles: 'El usuario no cuenta con ningun pedido realizandose' })
            }

        });
}
export let obtenerNumPedidosEnProceso = (req: Request, res: Response) => {
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
                { _id: Types.ObjectId(res.locals.usuario._id) },
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
        .exec((err: NativeError, pedidos: any[]) => {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar los pedidos' })
            }
            return res.json(pedidos);
        });
}
export let obtenerPedidosEnCola = (req: Request, res: Response) => {
    Pedido.find({ fotografo: null, sucursal: res.locals.usuario.sucursal })
        .populate('productos')
        .populate('cliente')
        .exec((err: NativeError, pedidosEncontrados: IPedido[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los pedidos' })
            return res.json(pedidosEncontrados)
        });
}
export let obtenerNumPedidosEnCola = (req: Request, res: Response) => {
    Pedido.find({ fotografo: null, sucursal: res.locals.usuario.sucursal })
        .countDocuments()
        .exec((err: NativeError, pedidosEncontrados: IPedido[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los pedidos' })
            return res.json(pedidosEncontrados);
        });
}
export let obtenerProductosPorPedido = (req: Request, res: Response) => {
    Pedido.findById(req.params.id)
        .populate('productos.producto')
        .exec((err: NativeError, pedido: IPedido) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener los productos' });
            return res.json(pedido.productos);
        });
}
export let crearPedido = (req: Request, res: Response) => {
    let pedidoAlta = new Pedido(req.body);
    if (!pedidoAlta.fotografo) {
        pedidoAlta.fotografo = null;
    }
    if (pedidoAlta.c_retoque) pedidoAlta.status = 'En espera';
    else pedidoAlta.status = 'Finalizado';
    pedidoAlta.usuario = res.locals.usuario;
    pedidoAlta.sucursal = res.locals.usuario.sucursal;
    pedidoAlta.save((err: NativeError, pedidoGuardado: IPedido) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear el pedido' });
        }
        if (pedidoAlta.fotografo) {
            Usuario.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    pedidosTomados: pedidoGuardado
                }
            }, (err: NativeError, ok) => { if (err) { } })
        }
        if (pedidoAlta.cliente) {
            Cliente.findByIdAndUpdate(pedidoAlta.cliente, {
                $push: {
                    pedidos: pedidoAlta
                }
            }, (err: NativeError, cliente: ICliente | null) => {
                if (err) return res.status(422).send({ titulo: 'Error al crear pedido', detalles: 'No se pudo crear el pedido' });
                if (cliente) {
                    let opciones = {
                        from: '"Estudio de Luna" <j.alonso.jacl2@gmail.com>',
                        to: cliente.email,
                        subject: 'Nuevo pedido creado',
                        html: `<b>Tu pedido ha sido creado, fecha de entrega estimada: ${pedidoAlta.fecha_entrega}</b>` // html body

                    }
                    transporter.sendMail(opciones, (err: Error | null, info: any) => {
                        if (err) res.status(422).send({ titulo: 'Error al enviar correo', detalles: 'Ocurrio un error al enviar el correo electronico, por favor intentalo de nuevo mas tarde' });
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    })
                }
            })
        }
        Pedido.findById(pedidoGuardado._id)
            .populate('productos')
            .populate('cliente')
            .exec((err: NativeError, pedidoEncontrado: IPedido) => {
                if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar el pedido' });
                return res.json(pedidoEncontrado);
            });
    });
}
export let tomarPedido = (req: Request, res: Response) => {
    Pedido.findOneAndUpdate({ _id: req.params.idPedido }, {
        fotografo: req.params.id,
        status: 'En retoque'
    }).exec((err: NativeError, pedidoActualizado: IPedido) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
        Usuario.updateOne({ _id: req.params.id }, {
            $push: {
                pedidosTomados: pedidoActualizado
            },
            $set: {
                ocupado: true,
            }
        }).exec((err: NativeError, actualizado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
            if (actualizado) {
                Pedido.find({ fotografo: null }).exec((err: NativeError, pedidos: IPedido[]) => {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
                    return res.json(pedidos);
                });
            }
        });
    });
}
export let actualizarEstadoPedido = (req: Request, res: Response) => {
    Pedido.findOneAndUpdate({ _id: req.body._id }, {
        $set: {
            status: req.body.status
        }
    }).exec((err: NativeError, pedidoActualizado: IPedido) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' });
        Pedido
            .findById(pedidoActualizado._id)
            .populate('cliente')
            .exec((err: NativeError, pedido: IPedido | null) => {
                if (pedido) {
                    if (pedido.cliente && pedido.status == 'Finalizado') {
                        let opciones = {
                            from: '"Estudio de Luna" <j.alonso.jacl2@gmail.com>',
                            to: pedido.cliente.email,
                            subject: 'Pedido listo',
                            html: `<b>Tu pedido ya esta disponible para ser recogido</b>` // html body

                        }
                        transporter.sendMail(opciones, (err: Error | null, info: any) => {
                            if (err) return res.status(422).send({ titulo: 'Error al enviar correo', detalles: 'Ocurrio un error al enviar el correo electronico, por favor intentalo de nuevo mas tarde' });
                            console.log("Message sent: %s", info.messageId);
                            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                        })
                    }
                    return res.status(200).json(pedido);
                } else return res.status(404).send({ titulo: 'Error al actualizar el estado del pedido', detalles: 'Ocurrio un error al actualizar el estado del pedido, posiblemente no exista.' });
            });
    });
}
export let actualizarAnticipoPedido = (req: Request, res: Response) => {
    Pedido.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            anticipo: req.params.anticipo
        }
    }).exec((err: NativeError, pedidoActualizado: IPedido) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar el pedido' })
        Pedido.findById(pedidoActualizado._id).exec(function (err, pedido) {
            return res.json(pedido)
        });
    });
}
export let eliminarNotificacionPorPedido = (req: Request, res: Response) => {
    Notificacion.findOne({ num_pedido: req.params.num })
        .exec((err: NativeError, notificacion: INotificacion) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
            if (notificacion) {
                Notificacion.deleteOne({ _id: req.params.id })
                    .exec((err: NativeError, eliminada: INotificacion) => {
                        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al eliminar la notificacion' });
                        if (eliminada) return res.json({ titulo: 'Notificacion eliminada', detalles: 'Notificacion eliminada exitosamente' });
                    });
            }
        });
}