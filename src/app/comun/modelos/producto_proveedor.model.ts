import { Proveedor } from './proveedor.model';

export class ProductoProveedor {
    _id:string;
    nombre: string;
    costo: number;
    proveedor: Proveedor;
    detalles: string;
    existencias: number;
    activo:number;
    constructor() { }

    nuevoProducto(_id: string,nombre:string,costo:number,proveedor: any, detalles:string, existencias:number,activo:number){
        let nuevoProducto = new ProductoProveedor();
        nuevoProducto._id = _id;
        nuevoProducto.nombre = nombre;
        nuevoProducto.costo = costo;
        nuevoProducto.proveedor = proveedor;
        nuevoProducto.detalles = detalles;
        nuevoProducto.existencias = existencias;
        nuevoProducto.activo = activo;
        return nuevoProducto;
    }
}