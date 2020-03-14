import { Proveedor } from './proveedor.model';
import { Almacen } from './almacen.model';
import Usuario from 'server/clases/usuario';
class HistorialMov {
    fecha: Date;
    numFactura: number;
    usuario: Usuario;
    tipo: string;
    constructor() { }
}
export class ProductoProveedor {
    _id: string;
    id: number;
    codigoBarras: string;
    nombre: string;
    costo: number;
    proveedor: Proveedor;
    detalles: string;
    almacen: Almacen;
    historialMov: HistorialMov[];
    //traspasos
    activo: number;
    constructor() { }

    nuevoProducto(_id: string, id: number, codigoBarras: string, nombre: string, costo: number, proveedor: any, detalles: string, activo: number) {
        let nuevoProducto = new ProductoProveedor();
        nuevoProducto._id = _id;
        nuevoProducto.id = id;
        nuevoProducto.codigoBarras = codigoBarras;
        nuevoProducto.nombre = nombre;
        nuevoProducto.costo = costo;
        nuevoProducto.proveedor = proveedor;
        nuevoProducto.detalles = detalles;
        nuevoProducto.activo = activo;
        return nuevoProducto;
    }
}