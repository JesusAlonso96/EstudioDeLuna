import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name:'productosFiltro'   
})
export class ProductosFiltroPipe implements PipeTransform {
    transform(productos: any[], buscador: any):any[] {
        if (!productos || !buscador) return productos;
        var buscador2 = Number(buscador);
        let arrayAux: any[] = new Array;
        for(let i = 0; i < productos.length; i ++ ){
            if(buscador2 === productos[i].precio){
                
                console.log("entre", productos[i].precio)
                arrayAux.push(productos[i]);
            }
        }
        return arrayAux;
    }

}