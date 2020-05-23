import { Pipe, PipeTransform } from '@angular/core';
import * as momento from 'moment';

@Pipe({
    name: 'formatoFecha'
})
export class FormatoFechaPipe implements PipeTransform {

    transform(valor: any, tipo: number): string {
        switch (tipo) {
            case 0: return momento(valor).locale('es').format('DD [de] MMMM [del] YYYY [a las] hh:mm:s a');
            case 2: return momento(valor).locale('es').format('DD/MMMM/YYYY');
            case 3: return momento(valor).locale('es').format('LLLL');
            default: return momento(valor).locale('es').format('DD [de] MMMM [del] YYYY');
        }

    }
}