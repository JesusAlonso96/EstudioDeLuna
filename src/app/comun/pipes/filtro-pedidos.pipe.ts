import { Pipe, PipeTransform } from '@angular/core';
import { Pedido } from '../modelos/pedido.model';

@Pipe({
  name: 'filtroPedidos'
})
export class FiltroPedidosPipe implements PipeTransform {

  transform(pedidos: Pedido[], parametroBusqueda: string): any {
    if (parametroBusqueda == '') return pedidos;
    return pedidos.filter(pedido=>pedido.num_pedido.toString().indexOf(parametroBusqueda) !== -1);
  }
}
