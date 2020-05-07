import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { DetallesProductoComponent } from 'src/app/comun/componentes/modales/detalles-producto/detalles-producto.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
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
  constructor(public dialog: MatDialog, private empleadoService: EmpleadoService, private authService: ServicioAutenticacionService, private toastr: NgToastrService) {
  }

  ngOnInit() {
    this.obtenerPedidos();
  }
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargando.cargando = cargando;
    this.cargando.texto = texto;
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
    this.crearVistaCargando(true, 'Actualizando estado del pedido...');
    this.empleadoService.actualizarEstado(pedido).subscribe(
      (pedidoActualizado) => {
        if (pedidoActualizado.status == 'Finalizado') {
          this.pedidos.splice(this.pedidos.indexOf(pedido), 1);
          this.actualizarEstadoFotografo();
        }
        this.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  actualizarEstadoFotografo() {
    if (this.pedidos.length == 0) {
      this.crearVistaCargando(true, 'Actualizando estado...')
      this.empleadoService.actualizarEstadoFotografo(this.authService.getIdUsuario()).subscribe(
        (actualizado) => {
          this.crearVistaCargando(false);
          this.toastr.abrirToastr('exito', 'Tu estado ha sido actualizado', 'Ya no estas ocupado, posiblemente lleguen mas pedidos');
        },
        (err: HttpErrorResponse) => {
          this.crearVistaCargando(false);
          this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles)
        }
      );
    }
  }
  obtenerPedidos() {
    this.crearVistaCargando(true, 'Cargando pedidos...')
    this.empleadoService.obtenerPedidosEnProceso(this.authService.getIdUsuario()).subscribe(
      (pedidos) => {
        this.pedidos = pedidos[0].pedido;
        this.crearVistaCargando(false);
      },
      (err) => {
        this.toastr.abrirToastr('info', 'No hay pedidos en proceso', '')
        this.pedidos = [];
        this.crearVistaCargando(false);
      }
    );
  }
  verDetalles(pedido: Pedido) {
    this.empleadoService.obtenerProductosPorPedido(pedido._id).subscribe(
      (productos) => {
        pedido.productos = productos;
        const dialogRef = this.dialog.open(DetallesProductoComponent, {
          width: '60%',
          data: { pedido, tipo: 0 }
        });
      }
    );
  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
  }

}
