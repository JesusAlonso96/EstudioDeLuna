import { Request, Response } from "express";
import { Estado, IEstado } from "../modelos/estado.model"
import { NativeError } from "mongoose";
import { Municipio, IMunicipio } from "../modelos/municipio.model";


export let obtenerEstados = (req: Request, res: Response) => {
    Estado.find()
        .exec((err: NativeError, estados: IEstado[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los estados' });
            return res.json(estados);
        });
}
export let obtenerMunicipios = (req: Request, res: Response) => {
    Municipio.find({ estado: req.params.id })
        .exec((err: NativeError, municipios: IMunicipio) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cargar los municipios' });
            return res.json(municipios);
        })
}