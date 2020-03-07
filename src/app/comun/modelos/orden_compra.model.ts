import { Proveedor } from './proveedor.model';
import { ProductoProveedor } from './producto_proveedor.model';

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
    iva: number;
    total: number;
    costoEnvio: number;
    productosOrdenCompra: ProductoOrdenCompra[] = [];
    constructor(){} 
}