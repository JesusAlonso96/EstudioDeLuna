import { Request, Response } from 'express';
import { NativeError, Types } from 'mongoose';
import { GastoGeneral, IGastoGeneral } from '../modelos/gasto_general.model';
import { MetodosPago } from '../enumeraciones/metodos_pago';
import { TiposReporte } from '../enumeraciones/tipos_enumeraciones';



export let obtenerGastosGenerales = (req: Request, res: Response) => {
    GastoGeneral.find({ activo: true, sucursal: res.locals.usuario.sucursal })
        .exec((err: NativeError, gastosGenerales: IGastoGeneral[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los gastos generales, intentalo de nuevo mas tarde' });
            return res.status(200).json(gastosGenerales);
        })
}
export let obtenerGastosGeneralesEliminados = (req: Request, res: Response) => {
    GastoGeneral.find({ activo: false, sucursal: res.locals.usuario.sucursal })
        .exec((err: NativeError, gastosGenerales: IGastoGeneral[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los gastos generales, intentalo de nuevo mas tarde' });
            return res.status(200).json(gastosGenerales);
        })
}
export let obtenerGastoGeneralPorId = (req: Request, res: Response) => {
    GastoGeneral.findById(req.params.id)
        .exec((err: NativeError, gastoGeneral: IGastoGeneral | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudo obtener el gasto general, intentalo de nuevo mas tarde' });
            return res.status(200).json(gastoGeneral);
        })
}
export let nuevoGastoGeneral = (req: Request, res: Response) => {
    const nuevoGastoGeneral = new GastoGeneral(req.body);
    const resp = validarCamposGastoGeneral(nuevoGastoGeneral);
    if (resp.error) return res.status(400).send({ titulo: resp.titulo, detalles: resp.detalles });
    nuevoGastoGeneral.sucursal = res.locals.usuario.sucursal;
    nuevoGastoGeneral.save((err: any, gastoGeneral: IGastoGeneral) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar', detalles: 'No se pudo guardar el gasto general, intentalo de nuevo mas tarde' });
        return res.status(200).send(gastoGeneral);
    })
}
export let editarGastoGeneral = (req: Request, res: Response) => {
    const gastoGeneral = new GastoGeneral(req.body);
    const resp = validarCamposGastoGeneral(gastoGeneral);
    GastoGeneral.findByIdAndUpdate(req.params.id, {
        id: gastoGeneral.id,
        tipoGastoGeneral: gastoGeneral.tipoGastoGeneral,
        metodoPago: gastoGeneral.metodoPago,
        nombre: gastoGeneral.nombre,
        razonSocial: gastoGeneral.razonSocial,
        rfc: gastoGeneral.rfc,
        subtotal: gastoGeneral.subtotal,
        ieps: gastoGeneral.ieps,
        iva: gastoGeneral.iva,
        total: gastoGeneral.total,
        observaciones: gastoGeneral.observaciones
    })
        .exec((err: NativeError, gastoGeneral: IGastoGeneral | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (gastoGeneral) return res.status(200).json({ titulo: 'Gasto general actualizado', detalles: `El gasto general ${gastoGeneral.id} ha sido actualizado exitosamente` })
        })
}
export let eliminarGastoGeneral = (req: Request, res: Response) => {
    GastoGeneral.findByIdAndUpdate(req.params.id, {
        activo: false
    })
        .exec((err: NativeError, gastoGeneral: IGastoGeneral | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (gastoGeneral) return res.status(200).json({ titulo: 'Gasto general actualizado', detalles: `El gasto general  ${gastoGeneral.id} ha sido eliminado exitosamente` })
        })
}
export let restaurarGastoGeneral = (req: Request, res: Response) => {
    GastoGeneral.findByIdAndUpdate(req.params.id, {
        activo: true
    })
        .exec((err: NativeError, gastoGeneral: IGastoGeneral | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (gastoGeneral) return res.status(200).json({ titulo: 'Gasto general actualizado', detalles: `El gasto general  ${gastoGeneral.id} ha sido restaurado exitosamente` })
        })
}

export let obteneReporteGastosGeneralesPorFecha = (req: Request, res: Response) => {
    let seccionMatch;
    let seccionGroup;
    switch(Number(req.query.tipo)){
        case TiposReporte.Anual:
            seccionMatch = { 'anio': Number(req.query.anio) };
            seccionGroup = { $month: '$fecha' };
            break;
        case TiposReporte.Mensual:
            seccionMatch = { 'anio': Number(req.query.anio), 'mes': Number(req.query.mes) };
            seccionGroup = { $dayOfMonth: '$fecha' };
            break;
        case TiposReporte.Diario:
            seccionMatch = { 'anio': Number(req.query.anio), 'mes': Number(req.query.mes), 'dia': Number(req.query.dia) };
            seccionGroup = { $hour: '$fecha' };
            break;
    }
    GastoGeneral.aggregate()
        .match({
            sucursal: res.locals.usuario.sucursal,
            activo: 1
        })
        .project({
            _id: '$_id',
            id: '$id',
            anio: {$year: '$fecha'},
            mes: {$month: '$fecha'},
            dia: {$dayOfMonth: '$fecha'},
            total: '$total',
            fecha: '$fecha'
        })
        .match(seccionMatch)
        .group({
            _id: seccionGroup,
            total: {$sum: '$total'}
        })
        .exec((err: NativeError, datosGastosGenerales: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los datos de los gastos generales, intentalo de nuevo mas tarde' });
            return res.status(200).json(datosGastosGenerales);
        })
}

export let obteneReporteGastosGeneralesPorTipoGastoGeneral = (req: Request, res: Response) => {
    let seccionMatch;
    switch(Number(req.query.tipo)){
        case TiposReporte.Anual:
            seccionMatch = { 'anio': Number(req.query.anio) };
            break;
        case TiposReporte.Mensual:
            seccionMatch = { 'anio': Number(req.query.anio), 'mes': Number(req.query.mes) };
            break;
        case TiposReporte.Diario:
            seccionMatch = { 'anio': Number(req.query.anio), 'mes': Number(req.query.mes), 'dia': Number(req.query.dia) };
            break;
    }
    GastoGeneral.aggregate()
        .match({
            sucursal: res.locals.usuario.sucursal,
            activo: 1
        })
        .lookup({
            from: 'tipogastogenerals',
            localField: 'tipoGastoGeneral',
            foreignField: '_id',
            as: 'tipoGastoGeneral',
        })
        .unwind('tipoGastoGeneral')
        .project({
            _id: '$_id',
            id: '$id',
            anio: {$year: '$fecha'},
            mes: {$month: '$fecha'},
            dia: {$dayOfMonth: '$fecha'},
            total: '$total',
            fecha: '$fecha',
            tipoGastoGeneral: '$tipoGastoGeneral'
        })
        .match(seccionMatch)
        .group({
            _id: '$tipoGastoGeneral',
            total: {$sum: '$total'}
        })
        .exec((err: NativeError, datosGastosGenerales: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los datos de los gastos generales, intentalo de nuevo mas tarde' });
            return res.status(200).json(datosGastosGenerales);
        })
}
/* FUNCIONES AUXILIARES */
function validarCamposGastoGeneral(gastoGeneral: IGastoGeneral): { error: boolean, titulo: string, detalles: string } {
    if (!gastoGeneral.tipoGastoGeneral) return { error: true, titulo: 'Campo tipo de gasto general obligatorio', detalles: 'Por favor, ingresa el campo tipo de gasto general' };
    if (!gastoGeneral.metodoPago) return { error: true, titulo: 'Campo método de pago obligatorio', detalles: 'Por favor, ingresa el campo método de pago' };
    if (gastoGeneral.metodoPago != MetodosPago.Efectivo && gastoGeneral.metodoPago != MetodosPago.TransferenciaElectronicaDeFondos) return { error: true, titulo: 'Campo método de pago invalido', detalles: 'Por favor, ingresa un valor valido para el campo método de pago' };
    if (!gastoGeneral.nombre) return { error: true, titulo: 'Campo nombre del gasto general obligatorio', detalles: 'Por favor, ingresa el campo nombre del gasto general' };
    if (!gastoGeneral.razonSocial) return { error: true, titulo: 'Campo razon social obligatorio', detalles: 'Por favor, ingresa el campo razon social' };
    if (!gastoGeneral.rfc) return { error: true, titulo: 'Campo RFC obligatorio', detalles: 'Por favor, ingresa el campo RFC' };
    if (!gastoGeneral.subtotal) return { error: true, titulo: 'Campo subtotal obligatorio', detalles: 'Por favor, ingresa el campo subtotal' };
    if (!gastoGeneral.iva) return { error: true, titulo: 'Campo IVA obligatorio', detalles: 'Por favor, ingresa el campo IVA' };
    if (!gastoGeneral.porcentajeIva) return { error: true, titulo: 'Campo porcentaje IVA obligatorio', detalles: 'Por favor, ingresa el campo porcentaje IVA' };
    if (!gastoGeneral.total) return { error: true, titulo: 'Campo total obligatorio', detalles: 'Por favor, ingresa el campo total' };
    return { error: false, titulo: '', detalles: '' };
}