export class Direccion {
    calle: string;
    colonia: string;
    num_ext: number;
    num_int: number;
    cp: number;
    ciudad: string;
    estado: string;
}
export class Sucursal {
    _id: string;
    nombre: string;
    direccion: Direccion;
    activa: boolean;
    constructor() { }
}