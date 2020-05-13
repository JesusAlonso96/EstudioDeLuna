import { Request, Response } from 'express';
import { EmpresaCot, IEmpresaCot } from "../modelos/empresa_cot.model";
import { NativeError } from 'mongoose';
import { Cotizacion, ICotizacion } from '../modelos/cotizacion.model';

export let obtenerEmpresas = (req: Request, res: Response) => {
    EmpresaCot.find({ activa: 1, sucursal: res.locals.usuario.sucursal })
        .exec((err: NativeError, empresas: IEmpresaCot[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las empresas' });
            return res.json(empresas);
        })
}
export let nuevaEmpresa = (req: Request, res: Response) => {
    const nuevaEmpresa = new EmpresaCot(req.body);
    nuevaEmpresa.sucursal = res.locals.usuario.sucursal;
    nuevaEmpresa.save((err: NativeError, guardada: IEmpresaCot) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la empresa' });
        if (guardada) return res.json({ titulo: 'Empresa agregada', detalles: 'Empresa agregada exitosamente' });
    })
}
export let eliminarEmpresa = (req: Request, res: Response) => {
    EmpresaCot.findByIdAndUpdate(req.body._id, {
        activa: 0
    })
        .exec((err: NativeError, eliminada: IEmpresaCot) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar la empresa' });
            if (eliminada) return res.json({ titulo: 'Empresa eliminada', detalles: 'Empresa eliminada exitosamente' });
        })
}
export let editarEmpresa = (req: Request, res: Response) => {
    EmpresaCot.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        contacto: req.body.contacto,
        telefono: req.body.telefono,
        email: req.body.email,
        activa: req.body.activa
    })
        .exec((err: NativeError, actualizada: IEmpresaCot) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar la empresa' });
            if (actualizada) return res.json({ titulo: 'Empresa actualizada', detalles: 'Empresa actualizada exitosamente' });
        })
}
export let nuevaCotizacion = (req: Request, res: Response) => {
    const cotizacion = new Cotizacion(req.body);
    cotizacion.sucursal = res.locals.usuario.sucursal;
    cotizacion.save((err: NativeError, cotizacionGuardada: ICotizacion) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la cotizacion' });
        Cotizacion.findById(cotizacionGuardada._id)
            .populate({ path: 'asesor', select: 'nombre ape_pat ape_mat email' })
            .populate('empresa')
            .populate('productos.producto')
            .exec((err: NativeError, cotizacion: ICotizacion) => {
                if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la cotizacion' });
                return res.status(201).json(cotizacion);
            })
    });
}
export let obtenerCotizaciones = (req: Request, res: Response) => {
    Cotizacion.find({ sucursal: res.locals.usuario.sucursal }, { __v: 0 })
        .where({
            vigencia: {
                $gte: new Date().getFullYear()
            }
        })
        .populate('productos.producto', '-activo -caracteristicas -__v -familia -c_ad -c_r -b_n -nombre -num_fotos')
        .populate('asesor', '-_id -__v -ape_mat -asistencia -ocupado -pedidosTomados -activo -username -contrasena -rol -rol_sec')
        .populate('empresa', '-_id -activa -__v')
        .populate('datos', '-_id -__v')
        .sort({ num_cotizacion: 'desc' })
        .exec((err: NativeError, cotizaciones: ICotizacion[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo guardar la cotizacion' });
            return res.json(cotizaciones);
        });
}
