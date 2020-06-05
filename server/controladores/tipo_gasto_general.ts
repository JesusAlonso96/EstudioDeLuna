import { Request, Response } from 'express';
import { NativeError } from 'mongoose';
import { ITipoGastoGeneral, TipoGastoGeneral } from '../modelos/tipo_gasto_general.model';
import { TiposDePersona } from '../enumeraciones/tipos_de_persona';




export let obtenerTiposGastoGeneral = (req: Request, res: Response) => {
    TipoGastoGeneral.find({ activo: true, sucursal: res.locals.usuario.sucursal })
        .exec((err: NativeError, tiposGastoGeneral: ITipoGastoGeneral[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los tipos de gasto general, intentalo de nuevo mas tarde' });
            return res.status(200).json(tiposGastoGeneral);
        })
}
export let obtenerTiposGastoGeneralEliminados = (req: Request, res: Response) => {
    TipoGastoGeneral.find({ activo: false, sucursal: res.locals.usuario.sucursal })
        .exec((err: NativeError, tiposGastoGeneral: ITipoGastoGeneral[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudieron obtener los tipos de gasto general, intentalo de nuevo mas tarde' });
            return res.status(200).json(tiposGastoGeneral);
        })
}
export let obtenerTipoGastoGeneralPorId = (req: Request, res: Response) => {
    TipoGastoGeneral.findById(req.params.id)
        .exec((err: NativeError, tipoGastoGeneral: ITipoGastoGeneral | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'No se pudo obtener el tipo de gasto general, intentalo de nuevo mas tarde' });
            return res.status(200).json(tipoGastoGeneral);
        })
}
export let nuevoTipoGastoGeneral = (req: Request, res: Response) => {
    const nuevoTipoGastoGeneral = new TipoGastoGeneral(req.body);
    const resp = validarCamposTipoGastoGeneral(nuevoTipoGastoGeneral);
    if (resp.error) return res.status(400).send({ titulo: resp.titulo, detalles: resp.detalles });
    nuevoTipoGastoGeneral.sucursal = res.locals.usuario.sucursal;
    nuevoTipoGastoGeneral.save((err: any, tipoGastoGeneral: ITipoGastoGeneral) => {
        if (err) return res.status(422).send({ titulo: 'Error al guardar', detalles: 'No se pudo guardar el tipo de gasto general, intentalo de nuevo mas tarde' });
        return res.status(200).send(tipoGastoGeneral);
    })
}
export let editarTipoGastoGeneral = (req: Request, res: Response) => {
    const tipoGastoGeneral = new TipoGastoGeneral(req.body);
    const resp = validarCamposTipoGastoGeneral(tipoGastoGeneral);
    if (resp.error) return res.status(400).send({ titulo: resp.titulo, detalles: resp.detalles });
    TipoGastoGeneral.findByIdAndUpdate(req.params.id, {
        id: tipoGastoGeneral.id,
        nombre: tipoGastoGeneral.nombre,
        descripcion: tipoGastoGeneral.descripcion,
        tipoDePersona: tipoGastoGeneral.tipoDePersona,
        nombre_persona: tipoGastoGeneral.nombre_persona,
        ape_pat_persona: tipoGastoGeneral.ape_pat_persona,
        ape_mat_persona: tipoGastoGeneral.ape_mat_persona,
        razonSocial: tipoGastoGeneral.razonSocial,
        rfc: tipoGastoGeneral.rfc
    })
        .exec((err: NativeError, tipoGastoGeneral: ITipoGastoGeneral | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (tipoGastoGeneral) return res.status(200).json({ titulo: 'Tipo de gasto general actualizado', detalles: `El tipo de gasto general ${tipoGastoGeneral.id} ha sido actualizado exitosamente` })
        })
}
export let eliminarTipoGastoGeneral = (req: Request, res: Response) => {
    TipoGastoGeneral.findByIdAndUpdate(req.params.id, {
        activo: false
    })
        .exec((err: NativeError, tipoGastoGeneral: ITipoGastoGeneral | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (tipoGastoGeneral) return res.status(200).json({ titulo: 'Tipo de gasto general actualizado', detalles: `El tipo de gasto general  ${tipoGastoGeneral.id} ha sido eliminado exitosamente` })
        })
}
export let restaurarTipoGastoGeneral = (req: Request, res: Response) => {
    TipoGastoGeneral.findByIdAndUpdate(req.params.id, {
        activo: true
    })
        .exec((err: NativeError, tipoGastoGeneral: ITipoGastoGeneral | null) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Ocurrio un error al actualizar los datos, intentalo de nuevo mas tarde' });
            if (tipoGastoGeneral) return res.status(200).json({ titulo: 'Tipo de gasto general actualizado', detalles: `El tipo de gasto general  ${tipoGastoGeneral.id} ha sido restaurado exitosamente` })
        })
}

/* FUNCIONES AUXILIARES */
function validarCamposTipoGastoGeneral(tipoGastoGeneral: ITipoGastoGeneral): { error: boolean, titulo: string, detalles: string } {
    if (!tipoGastoGeneral.nombre) return { error: true, titulo: 'Campo nombre obligatorio', detalles: 'Por favor, ingresa el campo nombre' };
    if (!tipoGastoGeneral.tipoDePersona) return { error: true, titulo: 'Campo tipo de persona obligatorio', detalles: 'Por favor, ingresa el campo tipo de persona' };
    if (tipoGastoGeneral.tipoDePersona != TiposDePersona.Moral && tipoGastoGeneral.tipoDePersona != TiposDePersona.Fisica) return { error: true, titulo: 'Campo tipo de persona invalido', detalles: 'Por favor, ingresa un valor valido para el campo tipo de persona' };
    if (tipoGastoGeneral.tipoDePersona == TiposDePersona.Moral && !tipoGastoGeneral.razonSocial) return { error: true, titulo: 'Campo razon social obligatorio', detalles: 'Por favor, ingresa el campo razon social' };
    if (tipoGastoGeneral.tipoDePersona == TiposDePersona.Fisica && !tipoGastoGeneral.nombre_persona) return { error: true, titulo: 'Campo nombre de la persona obligatorio', detalles: 'Por favor, ingresa el campo nombre de la persona' }; 
    if (tipoGastoGeneral.tipoDePersona == TiposDePersona.Fisica && !tipoGastoGeneral.ape_pat_persona) return { error: true, titulo: 'Campo apellido paterno de la persona obligatorio', detalles: 'Por favor, ingresa el campo apellido paterno de la persona' }; 
    if (!tipoGastoGeneral.rfc) return { error: true, titulo: 'Campo RFC obligatorio', detalles: 'Por favor, ingresa el campo RFC' };
    return { error: false, titulo: '', detalles: '' };
}