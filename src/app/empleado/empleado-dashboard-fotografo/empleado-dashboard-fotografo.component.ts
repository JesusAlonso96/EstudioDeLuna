import { Component, OnInit  } from '@angular/core';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';

@Component({
  selector: 'app-empleado-dashboard-fotografo',
  templateUrl: './empleado-dashboard-fotografo.component.html',
  styleUrls: ['./empleado-dashboard-fotografo.component.scss']
})
export class EmpleadoDashboardFotografoComponent implements OnInit {
  proximos: boolean = false;
  numPedidosCola: number = 0;
  numPedidosProceso: number = 0;
  numPedidosRealizados: number = 0;
  numPedidosProximos: number = 0;
  cargando: boolean = false;
  constructor(private empleadoService: EmpleadoService, private toastr: ToastrService, private pedidosService: PedidosService) { }

  ngOnInit() {
    this.obtenerNumPedidosEnCola();
    this.obtenerNumPedidosEnColaTiempoReal();
    this.obtenerNumPedidosEnProceso();
    this.obtenerNumPedidosRealizados();
  }
  obtenerNumPedidosEnCola() {
    this.cargando = true;
    this.pedidosService.obtenerNumPedidosEnCola().subscribe(
      (num: any) => {
        this.numPedidosCola = num;
        this.cargando = false;
      },
      (err) => {
        this.toastr.error(err.error.details, err.error.title);
        this.cargando = false;
      }
    )
  }
  obtenerNumPedidosEnColaTiempoReal(){
    this.pedidosService.obtenerNumPedidosEnCola().subscribe(
      (num: number)=>{
        this.numPedidosCola = num;
      })
  }
  obtenerNumPedidosEnProceso() {
    this.cargando = true;
    this.pedidosService.obtenerNumPedidosEnProceso().subscribe(
      (num) => {
        if(num.length > 0) {
          this.numPedidosProceso = num[0].contador;
        }        
        this.cargando = false;

      },
      (err) => {
        this.toastr.error(err.error.details, err.error.title);
        this.cargando = false;
      }
    );
  }
  obtenerNumPedidosRealizados() {
    this.cargando = true;
    this.pedidosService.obtenerNumPedidosRealizados().subscribe(
      (num) => {
        if(num.length > 0){
          this.numPedidosRealizados = num[0].contador;
        }
        this.cargando = false;
      },
      (err) => {
        this.toastr.error(err.error.details, err.error.title)
        this.cargando = false;
      }
    );
  }
  toggleProximos() {
    this.proximos = !this.proximos;
  }
}
