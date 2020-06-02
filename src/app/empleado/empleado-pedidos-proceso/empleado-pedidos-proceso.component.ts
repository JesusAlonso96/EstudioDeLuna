import { Component, OnInit } from '@angular/core';
import { Pedido, ProductoPedido } from 'src/app/comun/modelos/pedido.model';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { DetallesProductoComponent } from 'src/app/comun/componentes/modales/detalles-producto/detalles-producto.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';
import * as moment from 'moment';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-empleado-pedidos-proceso',
  templateUrl: './empleado-pedidos-proceso.component.html',
  styleUrls: ['./empleado-pedidos-proceso.component.scss']
})
export class EmpleadoPedidosProcesoComponent implements OnInit {
  pedidos: Pedido[] = [];
  url_fotos: string = environment.url_fotos;
  parametroBusqueda: string = '';
  cargando: any = {
    cargando: false,
    texto: ''
  }
  constructor(
    public dialog: MatDialog,
    private pedidosService: PedidosService,
    private empleadoService: EmpleadoService,
    private authService: ServicioAutenticacionService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService) {
  }

  ngOnInit() {
    this.obtenerPedidos();
  }
  cambiarEstado(pedido: Pedido) {
    switch (pedido.status) {
      case 'En retoque':
        pedido.status = 'Imprimiendo';
        this.actualizarEstadoPedido(pedido);
        break;
      case 'Imprimiendo':
        if (pedido.c_adherible) {
          pedido.status = 'Poniendo adherible';
        } else { pedido.status = 'Cortando fotografias' }
        this.actualizarEstadoPedido(pedido);
        break;
      case 'Poniendo adherible':
        pedido.status = 'Cortando fotografias';
        this.actualizarEstadoPedido(pedido);
        break;
      case 'Cortando fotografias':
        pedido.status = 'Finalizado';
        this.actualizarEstadoPedido(pedido);
        break;
    }

  }
  actualizarEstadoPedido(pedido) {
    this.cargandoService.crearVistaCargando(true, 'Actualizando estado del pedido...');
    this.pedidosService.actualizarEstado(pedido).subscribe(
      (pedidoActualizado) => {
        if (pedidoActualizado.status == 'Finalizado') {
          this.pedidos.splice(this.pedidos.indexOf(pedido), 1);
          this.actualizarEstadoFotografo();
        }
        this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  actualizarEstadoFotografo() {
    if (this.pedidos.length == 0) {
      this.cargandoService.crearVistaCargando(true, 'Actualizando estado...')
      this.empleadoService.actualizarEstadoFotografo(this.authService.getIdUsuario()).subscribe(
        (actualizado) => {
          this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('exito', 'Tu estado ha sido actualizado', 'Ya no estas ocupado, posiblemente lleguen mas pedidos');
        },
        (err: HttpErrorResponse) => {
          this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles)
        }
      );
    }
  }
  obtenerPedidos() {
    this.cargandoService.crearVistaCargando(true, 'Cargando pedidos...')
    this.pedidosService.obtenerPedidosEnProceso(this.authService.getIdUsuario()).subscribe(
      (pedidos) => {
        this.pedidos = pedidos[0].pedido;
        this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('info', 'No hay pedidos en proceso', '')
        this.pedidos = [];
        this.cargandoService.crearVistaCargando(false);
      }
    );
  }
  verDetalles(pedido: Pedido) {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo productos del pedido...')
    this.pedidosService.obtenerProductosPorPedido(pedido._id).subscribe(
      (productos: ProductoPedido[]) => {
        this.cargandoService.crearVistaCargando(false);
        pedido.productos = productos;
        this.dialog.open(DetallesProductoComponent, { disableClose: true, width: '55%', data: { pedido, tipo: 0 } });
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
  }
  verificarFechaEntrega(fecha: Date): number {
    const tiempoEnHoras: number = moment(fecha).diff(new Date(Date.now()), 'hours');
    if ((tiempoEnHoras / 24) >= 1) return 0; // pedido ok
    else if ((tiempoEnHoras / 24) <= 0) return 1; //pedido expirado
    else return 2; //pedido proximo
  }
  crearMensajeFechaEntrega(fecha: Date): string {
    const tiempoEnHoras: number = moment(fecha).diff(new Date(Date.now()), 'hours');
    const tiempoEnDias: number = moment(fecha).diff(new Date(Date.now()), 'days');
    const tiempoEnMinutos: number = moment(fecha).diff(new Date(Date.now()), 'minutes');
    if ((tiempoEnHoras / 24) < 1) {
      console.log(tiempoEnHoras / 24)
      if ((tiempoEnHoras / 24) >= 0 && (tiempoEnHoras / 24) <= 1) return `Faltan ${tiempoEnMinutos} minutos`;
      else if ((tiempoEnHoras / 24) <= 0) return 'El pedido esta retrasado!'
      else return `Faltan ${tiempoEnHoras} horas`;
    };
    if ((tiempoEnHoras / 24) > 1)`Faltan ${tiempoEnDias} dias`;
  }

}
