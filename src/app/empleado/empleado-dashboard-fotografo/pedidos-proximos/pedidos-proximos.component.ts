import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../servicio-empleado/empleado.service';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import * as momento from 'moment';
import {environment} from '../../../../environments/environment';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';

@Component({
  selector: 'app-pedidos-proximos',
  templateUrl: './pedidos-proximos.component.html',
  styleUrls: ['./pedidos-proximos.component.scss']
})
export class PedidosProximosComponent implements OnInit {
  pedidos: Pedido[];
  pedidosProximos: Pedido[] = [];
  url_fotos: string = environment.url_fotos;
  num_pedidos: number = 0;
  constructor(private pedidosService: PedidosService, private authService: ServicioAutenticacionService) { }

  ngOnInit() : any{
    this.obtenerPedidos()
  }
  obtenerPedidos(){
    this.pedidosService.obtenerPedidosEnProceso(this.authService.getIdUsuario()).subscribe(
      (pedidos)=>{
        this.pedidos = pedidos[0].pedido
        this.obtenerPedidosProximos();
      }
    );
  }
  obtenerPedidosProximos(){
    var fechaActual = momento(new Date(Date.now()))
    for(let i = 0; i < this.pedidos.length; i++){
      var fechaEntrega = momento(this.pedidos[i].fecha_entrega)
      var diff = fechaEntrega.diff(fechaActual,'minutes');
      if(diff >= 0 && diff <= 60){
        this.pedidosProximos.push(this.pedidos[i]);
      }
    }
  }

}
