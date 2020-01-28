import { Pipe, PipeTransform } from '@angular/core';
import * as momento from 'moment';

@Pipe({
    name: 'formatoFecha'
})
export class FormatoFechaPipe implements PipeTransform{

    transform(valor: any, tipo:number): string{
        if(tipo == 0){
            return momento(valor).locale('es').format('DD [de] MMMM [del] YYYY [a las] hh:mm:s a')
        } else {
            return momento(valor).locale('es').format('DD [de] MMMM [del] YYYY');
        }
        
    }
}