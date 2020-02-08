import { Pipe, PipeTransform } from '@angular/core';
import { ProductoProveedor } from '../modelos/producto_proveedor.model';

@Pipe({
  name: 'filtroProductos'
})
export class FiltroProductosPipe implements PipeTransform {

  transform(productos: ProductoProveedor[], parametroBusqueda: string): any {
    if(parametroBusqueda == '') return productos;
    return productos.filter(producto => producto.nombre.trim().toLowerCase().indexOf(parametroBusqueda.trim().toLowerCase()) !== -1);
  }

}
