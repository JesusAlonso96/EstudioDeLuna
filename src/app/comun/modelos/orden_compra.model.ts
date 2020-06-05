import { Proveedor } from './proveedor.model';
import { ProductoProveedor } from './producto_proveedor.model';
import Usuario from 'server/clases/usuario';

export class ProductoOrdenCompra {
    insumo: ProductoProveedor = new ProductoProveedor();
    cantidadOrden: number;
    constructor() { }
}

export class OrdenCompra {
    id: number;
    proveedor: Proveedor = new Proveedor();
    fechaPedido: Date;
    fechaEntrega: Date;
    terminosEntrega: string;
    terminosPago: string;
    lugarEntrega: string;
    subtotal: number;
    iva: boolean;
    total: number;
    costoEnvio: number;
    productosOrdenCompra: ProductoOrdenCompra[] = [];
    usuario: Usuario;
    activa: boolean;
    constructor() { }
}