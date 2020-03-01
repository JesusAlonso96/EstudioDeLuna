import { ProductoProveedor } from './producto_proveedor.model';
class Direccion {
    calle: string;
    colonia: string;
    num_ext: number;
    num_int: number;
    cp: number;
    ciudad: string;
    estado: string;
    constructor() { }
}
export class Almacen {
    _id: string;
    id: number;
    nombre: string;
    direccion: Direccion = new Direccion();
    insumos: ProductoProveedor[];
    constructor() { }
    nuevoAlmacen(_id: string, id: number, nombre: string, calle: string, colonia: string, num_ext: number, num_int: number, cp: number, ciudad: string, estado: string) {
        let nuevoAlmacen = new Almacen();
        nuevoAlmacen._id = _id;
        nuevoAlmacen.id = id;
        nuevoAlmacen.nombre = nombre;
        nuevoAlmacen.direccion.calle = calle;
        nuevoAlmacen.direccion.colonia = colonia;
        nuevoAlmacen.direccion.num_ext = num_ext;
        nuevoAlmacen.direccion.num_int = num_int;
        nuevoAlmacen.direccion.cp = cp;
        nuevoAlmacen.direccion.ciudad = ciudad;
        nuevoAlmacen.direccion.estado = estado;
        return nuevoAlmacen;

    }
}