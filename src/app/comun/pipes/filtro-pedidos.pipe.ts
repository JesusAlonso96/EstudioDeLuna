import { Pipe, PipeTransform } from '@angular/core';
import { Pedido } from '../modelos/pedido.model';

@Pipe({
  name: 'filtroPedidos'
})
export class FiltroPedidosPipe implements PipeTransform {

  transform(value: any, parametroBusqueda: any): any {
    const resultado = [];
    if (parametroBusqueda == '') return value;
    for (let pedido of value) {
      if (pedido.num_pedido == <Number>parametroBusqueda) {
        resultado.push(pedido)
      }
    }
    return resultado;
  }
}
