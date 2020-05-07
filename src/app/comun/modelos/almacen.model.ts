import { ProductoProveedor } from './producto_proveedor.model';
import { Sucursal } from './sucursal.model';
import { Usuario } from './usuario.model';
import { Traspaso } from './traspaso.model';
import { Inventario } from './inventario.model';
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
export class InsumoAlmacen {
    insumo: ProductoProveedor;
    existencia: number;
    seleccionado?: number;
    cantidadMovimiento?: number;
}
export class Movimiento {
    _id: string;
    fecha: Date;
    numFactura: number;
    insumo: ProductoProveedor;
    usuario: Usuario;
    traspaso?: string | Traspaso;
    inventario?: string | Inventario;
    almacen?: Almacen
    tipo: string;
    cantidadMovimiento: number;
    existenciaActual: number; 
    observaciones: string;
}
export class Almacen {
    _id: string;
    id: number;
    nombre: string;
    direccion: Direccion = new Direccion();
    insumos: InsumoAlmacen[];
    historialMov: Movimiento[];
    sucursal: Sucursal = new Sucursal();
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