import { Producto } from './producto.model';

export class ProductoCot {
    _id: string;
    producto: Producto;
    cantidad: number;
    constructor() { }
    nuevoProducto(producto: Producto, cantidad: number): ProductoCot {
        let productoCot: ProductoCot = new ProductoCot();
        productoCot.producto = producto;
        productoCot.cantidad = cantidad;
        return productoCot;
    }
}