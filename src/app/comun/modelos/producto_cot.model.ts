import { Producto } from './producto.model';

export class ProductoCot {
    _id: string;
    producto: Producto;
    precioUnitario: number;
    cantidad: number;
    constructor() { }
    nuevoProducto(producto: Producto, cantidad: number, precioUnitario: number): ProductoCot {
        let productoCot: ProductoCot = new ProductoCot();
        productoCot.producto = producto;
        productoCot.cantidad = cantidad;
        productoCot.precioUnitario = precioUnitario;
        return productoCot;
    }
}