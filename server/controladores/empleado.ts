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

export let actualizarCaja = (req: Request, res: Response) => {
    actualizarCantidadesCaja(req.params.id, Number(req.params.cantidadACaja), req.params.metodoPago, res);
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