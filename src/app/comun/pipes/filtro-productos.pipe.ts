import { Pipe, PipeTransform } from '@angular/core';
import { ProductoProveedor } from '../modelos/producto_proveedor.model';

@Pipe({
  name: 'filtroProductos'
})
export class FiltroProductosPipe implements PipeTransform {

  transform(productos: ProductoProveedor[], parametroBusqueda: string): any {
    let filtro: ProductoProveedor[] = [];
    console.log(productos);
    if (parametroBusqueda == '') return productos;
    for (let producto of productos) {
      if (producto.nombre.trim().toLowerCase().indexOf(parametroBusqueda.trim().toLowerCase()) !== -1) {
        filtro.push(producto);
      }
    }
    return filtro;
  }

}
