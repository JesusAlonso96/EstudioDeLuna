import { Request, Response, NextFunction } from 'express';
import { Usuario, IUsuario } from "../modelos/usuario.model";
import { NativeError, Types } from 'mongoose';
import { Cliente, ICliente } from '../modelos/cliente.model';
import { Pedido, IPedido } from '../modelos/pedido.model';
import moment from 'moment';
import { IVenta, Venta } from '../modelos/venta.model';
import { Caja, ICaja } from '../modelos/caja.model';
import { Notificacion, INotificacion } from '../modelos/notificacion.model';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: 'j.alonso.jacl2@gmail.com',
        pass: 'papanatas.1234'
    }
})

export let asignarFotografo = (req: Request, res: Response) => {
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
            sucursal: Types.ObjectId(res.locals.usuario.sucursal),
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
        .exec((err: NativeError, asistencia) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Error al asignar al fotografo' });
            if (asistencia.length > 0) {
                return res.json(asistencia);
            } else {
                return res.status(422).send({ titulo: 'No hay ningun fotografo desocupado' })
            }
        });
}
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
export let tieneAsistenciaTrabajador = (req: Request, res: Response) => {
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
            _id: Types.ObjectId(req.params.id)
        })
        .project({
            _id: 0,
            nombre: 1,
            asistencia: 1

        })
        .exec((err: NativeError, asistencia: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al intentar verificar la asistencia' });
            if (asistencia.length > 0) {
                return res.json({ titulo: 'Asistio' })
            } else {
                return res.json({ titulo: 'No asistio' })
            }
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
export let crearFoto = (req: Request, res: Response) => {
    var path = req.file.path.split('\\', 2)[1];
    Pedido.updateOne({ _id: req.params.id }, {
        $set: {
            foto: path
        }
    }).exec((err: NativeError, pedidoActualizado: IPedido) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al subir la imagen, por favor intentalo de nuevo' });
        return res.status(200).json(pedidoActualizado);
    });
}
export let realizarVenta = (req: Request, res: Response) => {
    var fecha = moment(new Date(Date.now())).format('YYYY-MM-DD');
    var hora = moment(new Date(Date.now())).format('h:mm:ss a');
    const venta = new Venta({
        pedido: req.body,
        fecha: fecha,
        hora: hora,
        vendedor: res.locals.usuario._id,
        sucursal: res.locals.usuario.sucursal
    })
    venta.save((err: NativeError, exito: IVenta) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
        actualizarCantidadesCaja(req.params.id, Number(req.params.cantidadACaja), req.params.metodoPago, res);
        return res.json(exito);
    })
}
export let obtenerPedidosPorEmpleado = (req: Request, res: Response) => {
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
                { _id: Types.ObjectId(req.params.id) },
                {
                    $or: [
                        { "pedidosTomados.status": 'Vendido' },
                        { "pedidosTomados.status": 'Finalizado' }
                    ]
                }
            ]
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
export let obtenerProductosPorPedido = (req: Request, res: Response) => {
    Pedido.findById(req.params.id) 
        .populate('productos')
        .exec((err: NativeError, pedido: IPedido) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener los productos' });
            return res.json(pedido.productos);
        });
}
export let obtenerFotografos = (req: Request, res: Response) => {
    Usuario.find({ rol: 0, rol_sec: 1, sucursal: res.locals.usuario.sucursal })
        .exec((err: NativeError, fotografosEncontrados: IUsuario[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a los fotografos' })
            return res.json(fotografosEncontrados);
        })
}
export let obtenerFotografo = (req: Request, res: Response) => {
    Usuario.findById(req.params.id)
        .exec((err: NativeError, fotografo: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se encontro al fotografo' })
            return res.json(fotografo);
        });
}
export let obtenerNotificaciones = (req: Request, res: Response) => {
    var fecha = new Date(req.params.fecha);
    Notificacion.find({ $or: [{ usuario: req.params.id }, { usuario: null }], fecha: fecha })
        .sort({ num_pedido: -1 })
        .exec((err: NativeError, notificaciones: INotificacion[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al cargar a las notificaciones' })
            return res.json(notificaciones);
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
export let eliminarNotificacion = (req: Request, res: Response) => {
    Notificacion.findById(req.params.id)
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
export let eliminarNotificaciones = () => {
    Notificacion.deleteMany({})
        .exec((err, eliminadas) => { if (err) { } if (eliminadas) { } })
}
export let actualizarOcupado = (req: Request, res: Response) => {
    Usuario.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            ocupado: false
        }
    }).exec((err: NativeError, actualizado: IUsuario) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el estado del fotografo' })
        if (actualizado) return res.json({ titulo: 'Usuario actualizado', detalles: 'Usuario actualizado correctamente' });
    });
}
export let obtenerPedidos = (req: Request, res: Response) => {
    Pedido.find({ sucursal: res.locals.usuario.sucursal }).exec((err: NativeError, pedidos: IPedido[]) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener todos los pedidos' })
        return res.json(pedidos);
    });
}
export let actualizarCaja = (req: Request, res: Response) => {
    actualizarCantidadesCaja(req.params.id, Number(req.params.cantidadACaja), req.params.metodoPago, res);
}
export let fotografoMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.usuario.rol !== 0 && res.locals.rol_sec !== 1) {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para crear un pedido' })
    } else {
        next();
    }
}
export let recepcionistaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.usuario.rol == 0 && res.locals.usuario.rol_sec == 2) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para crear un pedido' })
    }
}
/* Funciones auxiliares */
export function actualizarCantidadesCaja(idCaja: string, cantidad: number, metodoPago: string, res: Response) {
    let cantidadSuma = cantidad;
    switch (metodoPago) {
        case 'efectivo':
            Caja.findById(idCaja).exec((err: NativeError, caja: ICaja) => {
                if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                let cajaCantidad = caja.cantidadTotal + cantidadSuma;
                let cajaEfectivo = caja.cantidadEfectivo + cantidadSuma;
                Caja.updateOne({ _id: caja._id }, { cantidadTotal: cajaCantidad, cantidadEfectivo: cajaEfectivo })
                    .exec((err: NativeError, cajaActualizada: ICaja) => {
                        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                    })
            })
            break;

        case 'tarjeta':
            Caja.findById(idCaja).exec((err: NativeError, caja: ICaja) => {
                if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                let cajaCantidad = caja.cantidadTotal + cantidadSuma;
                let cajaTarjetas = caja.cantidadTarjetas + cantidadSuma;
                Caja.updateOne({ _id: caja._id }, { cantidadTotal: cajaCantidad, cantidadTarjetas: cajaTarjetas })
                    .exec((err: NativeError, cajaActualizada: ICaja) => {
                        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo crear la venta' });
                    })
            })
            break;
    }
}