import { Pipe, PipeTransform } from '@angular/core';
import { Cotizacion } from '../modelos/cotizacion.model';

@Pipe({
  name: 'filtroCotizacion'
})
export class FiltroCotizacionPipe implements PipeTransform {

  transform(cotizaciones: Cotizacion[], num_cot: string): any {
    if (num_cot == '') return cotizaciones;
    return cotizaciones.filter(cotizacion => cotizacion.num_cotizacion.toString().indexOf(num_cot) !== -1);
  }

}
