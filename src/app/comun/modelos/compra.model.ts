import Usuario from 'server/clases/usuario';
import { Proveedor } from './proveedor.model';
import { Almacen } from './almacen.model';
import { ProductoProveedor } from './producto_proveedor.model';
export class InsumoCompra {
    insumo: ProductoProveedor;
    cantidad: number;
    subtotal: number;
}

export class Compra {
    _id: string;
    id: string;
    fecha: Date;
    usuario: Usuario;
    proveedor: Proveedor = new Proveedor();
    almacen: Almacen;
    numFactura: number;
    insumosCompra: InsumoCompra[] = [];
    subtotal: number;
    iva: number;
    costoEnvio: number;
    metodoPago: string;
    total: number;
    sucursal: any;

    constructor() { }

}