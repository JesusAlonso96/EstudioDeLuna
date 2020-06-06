import { Component, OnInit  } from '@angular/core';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

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
  constructor(private empleadoService: EmpleadoService,
     private toastr: NgToastrService, 
     private cargandoService: CargandoService,
     private pedidosService: PedidosService) { }

  ngOnInit() {
    this.obtenerNumPedidosEnCola();
    this.obtenerNumPedidosEnColaTiempoReal();
    this.obtenerNumPedidosEnProceso();
    this.obtenerNumPedidosRealizados();
  }
  obtenerNumPedidosEnCola() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo numero de pedidos en cola');
    this.pedidosService.obtenerNumPedidosEnCola().subscribe(
      (num: any) => {
        this.numPedidosCola = num;
        this.cargando = this.cargandoService.crearVistaCargando(false);
      },
      (err) => {
        this.toastr.abrirToastr('error',err.error.details, err.error.title);
        this.cargando = this.cargandoService.crearVistaCargando(false);
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
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo numero de pedidos en proceso');
    this.pedidosService.obtenerNumPedidosEnProceso().subscribe(
      (num) => {
        if(num.length > 0) {
          this.numPedidosProceso = num[0].contador;
        }        
        this.cargando = this.cargandoService.crearVistaCargando(false);

      },
      (err) => {
        this.toastr.abrirToastr('error',err.error.details, err.error.title);
        this.cargando = this.cargandoService.crearVistaCargando(false);
      }
    );
  }
  obtenerNumPedidosRealizados() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo numero de pedidos realizados');
    this.pedidosService.obtenerNumPedidosRealizados().subscribe(
      (num) => {
        if(num.length > 0){
          this.numPedidosRealizados = num[0].contador;
        }
        this.cargando = this.cargandoService.crearVistaCargando(false);
      },
      (err) => {
        this.toastr.abrirToastr('error',err.error.details, err.error.title)
        this.cargando = this.cargandoService.crearVistaCargando(false);
      }
    );
  }
  toggleProximos() {
    this.proximos = !this.proximos;
  }
}
