import { Request, Response } from 'express';
import { Caja, ICaja } from '../modelos/caja.model';
import { NativeError } from 'mongoose';
import { CorteCaja, ICorteCaja } from '../modelos/corte_caja.model';
import moment from 'moment';

export let obtenerCajas = (req: Request, res: Response) => {
    Caja.find({ activa: true, sucursal: res.locals.usuario.sucursal })
        .populate('sucursal')
        .exec((err: NativeError, cajas: ICaja[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener las cajas, por favor intentelo de nuevo mas tarde' })
            return res.json(cajas);
        })
}
export let obtenerCajasEliminadas = (req: Request, res: Response) => {
    Caja.find({ activa: false, sucursal: res.locals.usuario.sucursal })
        .populate('sucursal')
        .exec((err: NativeError, cajas: ICaja[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener las cajas, por favor intentelo de nuevo mas tarde' })
            return res.json(cajas);
        })
}
export let obtenerCaja = (req: Request, res: Response) => {
    Caja.findById(req.params.id)
        .populate('sucursal')
        .exec((err: NativeError, caja: ICaja[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Ocurrio un error al obtener la caja, por favor intentelo de nuevo mas tarde' })
            return res.json(caja);
        })
}
export let agregarCaja = (req: Request, res: Response) => {
    const caja = new Caja(req.body);
    caja.sucursal = res.locals.usuario.sucursal;
    caja.save((err: any, caja: ICaja) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar', detalles: 'Ocurrio un error al guardar la caja, por favor intentelo de nuevo mas tarde' })
        Caja.findById(caja._id)
            .populate('sucursal')
            .exec((err: NativeError, caja: ICaja) => {
                return res.json(caja);
            })
    })
}
export let eliminarCaja = (req: Request, res: Response) => {
    const caja = new Caja(req.body);
    Caja.findByIdAndUpdate(caja._id, {
        activa: false
    })
        .exec((err: NativeError, cajaEliminada: ICaja | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al eliminar caja', detalles: 'Ocurrio un error al eliminar la caja, por favor intentalo de nuevo mas tarde' });
            if (cajaEliminada) return res.status(200).send({ titulo: 'Caja eliminada', detalles: 'Se ha eliminado satisfactoriamente la caja' });
        })
}
export let restaurarCaja = (req: Request, res: Response) => {
    const caja = new Caja(req.body);
    Caja.findByIdAndUpdate(caja._id, {
        activa: true
    })
        .exec((err: NativeError, cajaEliminada: ICaja | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al restaurar caja', detalles: 'Ocurrio un error al restaurar la caja, por favor intentalo de nuevo mas tarde' });
            if (cajaEliminada) return res.status(200).send({ titulo: 'Caja restaurada', detalles: 'Se ha restaurado satisfactoriamente la caja' });
        })
}
export let actualizarCaja = (req: Request, res: Response) => {
    Caja.findOneAndUpdate({ _id: req.params._id }, {
        cantidadTotal: req.body.cantidadTotal,
        cantidadEfectivo: req.body.cantidadEfectivo,
        cantidadTarjetas: req.body.cantidadTarjetas
    })
        .exec((err: NativeError, cajaActualizada: ICaja) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar la caja', tipo: 2 });
            return res.json(cajaActualizada);
        })
}
export let existeCorteCaja = (req: Request, res: Response) => {
    const fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    CorteCaja.findOne({ caja: req.params.id, fecha }).exec((err: NativeError, corte: ICorteCaja | null) => {
        if (err) {
            console.log(err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo verificar la existencia del corte de caja', tipo: 2 })
        }
        if (corte) {
            return res.json({ encontrado: true });
        } else {
            return res.json({ encontrado: false });
        }
    })
}
export let crearCorteCaja = (req: Request, res: Response) => {
    var fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    var hora = moment(new Date()).format('h:mm:ss a');
    const corte = new CorteCaja({
        fecha,
        hora,
        usuario: res.locals.usuario,
        efectivoEsperado: req.body.efectivoEsperado,
        tarjetaEsperado: req.body.tarjetaEsperado,
        efectivoContado: req.body.efectivoContado,
        tarjetaContado: req.body.tarjetaContado,
        fondoEfectivo: req.body.fondoEfectivo,
        fondoTarjetas: req.body.fondoTarjetas,
        sucursal: res.locals.usuario.sucursal,
        caja: req.body.caja
    });
    corte.save((err: any, guardado: ICorteCaja) => {
        if (err) {
            console.log(err);
            return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el corte de caja', tipo: 2 })
        }
        return res.status(200).json(guardado);
    });
}
export let obtenerCortesCaja = (req: Request, res: Response) => {
    CorteCaja.find({ caja: req.params.id })
        .sort({
            num_corte: 'desc'
        })
        .exec((err: NativeError, cortesCaja: ICorteCaja[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener cortes de caja', detalles: 'Ocurrio un error al obtener los cortes de caja, por favor intentalo de nuevo' });
            return res.status(200).json(cortesCaja);
        })
}