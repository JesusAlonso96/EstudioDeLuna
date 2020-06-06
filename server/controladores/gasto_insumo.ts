import { Request, Response } from 'express';
import { NativeError, Types } from 'mongoose';
import { GastoInsumo, IGastoInsumo} from '../modelos/gasto_inusmo.model';
import { TiposReporte } from '../enumeraciones/tipos_enumeraciones';



export let obtenerGastosInsumos = (req: Request, res: Response) => {
    GastoInsumo.find({ activo: true, sucursal: res.locals.usuario.sucursal })
        .populate({path: 'compra', select: '_id fecha subtotal iva costoEnvio total metodoPago numFactura'})
        .exec((err: NativeError, gastosInsumos: IGastoInsumo[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los gastos de insumos, intentalo de nuevo mas tarde' });
            return res.status(200).json(gastosInsumos);
        })
}
export let obtenerGastosInsumosEliminados = (req: Request, res: Response) => {
    GastoInsumo.find({ activo: false, sucursal: res.locals.usuario.sucursal })
        .populate({path: 'compra', select: '_id fecha subtotal iva costoEnvio total metodoPago numFactura'})
        .exec((err: NativeError, gastosInsumos: IGastoInsumo[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los gastos de insumos, intentalo de nuevo mas tarde' });
            return res.status(200).json(gastosInsumos);
        })
}
export let obtenerGastoInsumoPorId = (req: Request, res: Response) => {
    GastoInsumo.findById(req.params.id)
        .exec((err: NativeError, gastoInsumo: IGastoInsumo | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudo obtener el gasto de insumo, intentalo de nuevo mas tarde' });
            return res.status(200).json(gastoInsumo);
        })
}
export let nuevoGastoInsumo = (req: Request, res: Response) => {
    const nuevoGastoInsumo= new GastoInsumo(req.body);
    console.log(nuevoGastoInsumo);
    const resp = validarCamposGastoInsumo(nuevoGastoInsumo);
    if (resp.error) return res.status(400).send({ titulo: resp.titulo, detalles: resp.detalles });
    nuevoGastoInsumo.sucursal = res.locals.usuario.sucursal;
    nuevoGastoInsumo.save((err: any, gastoInsumo: IGastoInsumo) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar', detalles: 'No se pudo guardar el gasto de insumo, intentalo de nuevo mas tarde' });
        GastoInsumo.populate(gastoInsumo, {path: 'compra', select: '_id fecha subtotal iva costoEnvio total metodoPago numFactura'})
        .then((gastoInsumoCompleto) => {
            return res.status(200).json(gastoInsumoCompleto);
        })
    })
}
export let editarGastoInsumo = (req: Request, res: Response) => {
    const gastoInsumo = new GastoInsumo(req.body);
    const resp = validarCamposGastoInsumo(gastoInsumo);
    GastoInsumo.findByIdAndUpdate(req.params.id, {
        id: gastoInsumo.id,
        compra: gastoInsumo.compra,
        razonSocial: gastoInsumo.razonSocial,
        rfc: gastoInsumo.rfc,
        observaciones: gastoInsumo.observaciones
    })
        .exec((err: NativeError, gastoInsumo: IGastoInsumo | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (gastoInsumo) return res.status(200).json({ titulo: 'Gasto de insumo actualizado', detalles: `El gasto de insumo ${gastoInsumo.id} ha sido actualizado exitosamente` })
        })
}
export let eliminarGastoInsumo = (req: Request, res: Response) => {
    GastoInsumo.findByIdAndUpdate(req.params.id, {
        activo: false
    })
        .exec((err: NativeError, gastoInsumo: IGastoInsumo | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (gastoInsumo) return res.status(200).json({ titulo: 'Gasto de insumo actualizado', detalles: `El gasto de insumo  ${gastoInsumo.id} ha sido eliminado exitosamente` })
        })
}
export let restaurarGastoInsumo = (req: Request, res: Response) => {
    GastoInsumo.findByIdAndUpdate(req.params.id, {
        activo: true
    })
        .exec((err: NativeError, gastoInsumo: IGastoInsumo | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (gastoInsumo) return res.status(200).json({ titulo: 'Gasto de insumo actualizado', detalles: `El gasto de insumo  ${gastoInsumo.id} ha sido restaurado exitosamente` })
        })
}

export let obteneReporteGastosInsumosPorFecha = (req: Request, res: Response) => {
    let seccionMatch;
    let seccionGroup;
    switch(Number(req.query.tipo)){
        case TiposReporte.Anual:
            seccionMatch = { 'anio': Number(req.query.anio) };
            seccionGroup = { $month: '$compra.fecha' };
            break;
        case TiposReporte.Mensual:
            seccionMatch = { 'anio': Number(req.query.anio), 'mes': Number(req.query.mes) };
            seccionGroup = { $dayOfMonth: '$compra.fecha' };
            break;
        case TiposReporte.Diario:
            seccionMatch = { 'anio': Number(req.query.anio), 'mes': Number(req.query.mes), 'dia': Number(req.query.dia) };
            seccionGroup = { $hour: '$compra.fecha' };
            break;
    }
    GastoInsumo.aggregate()
        .match({
            sucursal: res.locals.usuario.sucursal,
            activo: 1
        })
        .lookup({
            from: 'compras',
            localField: 'compra',
            foreignField: '_id',
            as: 'compra',
        })
        .unwind({
            path: '$compra',
        })
        .project({
            _id: '$_id',
            id: '$id',
            anio: {$year: '$compra.fecha'},
            mes: {$month: '$compra.fecha'},
            dia: {$dayOfMonth: '$compra.fecha'},
            'compra._id': '$compra._id',
            'compra.fecha': '$compra.fecha',
            'compra.total': '$compra.total'
        })
        .match(seccionMatch)
        .group({
            _id: seccionGroup,
            total: {$sum: '$compra.total'}
        })
        .exec((err: NativeError, datosCompras: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los datos de las compras, intentalo de nuevo mas tarde' });
            return res.status(200).json(datosCompras);
        })
}

export let obteneReporteGastosInsumosPorProveedor = (req: Request, res: Response) => {
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
    GastoInsumo.aggregate()
        .match({
            sucursal: res.locals.usuario.sucursal,
            activo: 1
        })
        .lookup({
            from: 'compras',
            localField: 'compra',
            foreignField: '_id',
            as: 'compra',
        })
        .unwind({
            path: '$compra',
        })
        .lookup({
            from: 'proveedors',
            localField: 'compra.proveedor',
            foreignField: '_id',
            as: 'compra.proveedor',
        })
        .unwind('compra.proveedor')
        .project({
            _id: '$_id',
            id: '$id',
            anio: {$year: '$compra.fecha'},
            mes: {$month: '$compra.fecha'},
            dia: {$dayOfMonth: '$compra.fecha'},
            'compra._id': '$compra._id',
            'compra.fecha': '$compra.fecha',
            'compra.total': '$compra.total',
            'compra.proveedor._id': '$compra.proveedor._id',
            'compra.proveedor.nombre': '$compra.proveedor.nombre'
        })
        .match(seccionMatch)
        .group({
            _id: '$compra.proveedor',
            total: {$sum: '$compra.total'}
        })
        .exec((err: NativeError, datosCompras: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los datos de las compras, intentalo de nuevo mas tarde' });
            return res.status(200).json(datosCompras);
        })
}

/* FUNCIONES AUXILIARES */
function validarCamposGastoInsumo(gastoInsumo: IGastoInsumo): { error: boolean, titulo: string, detalles: string } {
    console.log(gastoInsumo);
    if (!gastoInsumo.compra) return { error: true, titulo: 'Campo compra obligatorio', detalles: 'Por favor, ingresa el campo compra' };
    if (!gastoInsumo.razonSocial) return { error: true, titulo: 'Campo razon social obligatorio', detalles: 'Por favor, ingresa el campo razon social' };
    if (!gastoInsumo.rfc) return { error: true, titulo: 'Campo RFC obligatorio', detalles: 'Por favor, ingresa el campo RFC' };
    return { error: false, titulo: '', detalles: '' };
}