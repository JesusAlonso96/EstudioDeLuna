import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { DetallesProductoComponent } from 'src/app/comun/componentes/modales/detalles-producto/detalles-producto.component';
@Component({
  selector: 'app-empleado-pedidos-proceso',
  templateUrl: './empleado-pedidos-proceso.component.html',
  styleUrls: ['./empleado-pedidos-proceso.component.scss']
})
export class EmpleadoPedidosProcesoComponent implements OnInit {
  pedidos: Pedido[];
  cargandoPedidos: boolean;
  url_fotos: string;
  parametroBusqueda: string = '';
  constructor(public dialog: MatDialog, private empleadoService: EmpleadoService, private authService: ServicioAutenticacionService, private toastr: ToastrService) {
    this.pedidos = [];
    this.cargandoPedidos = false;
    this.url_fotos = environment.url_fotos;
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
      case 'Finalizado':
        pedido.status = 'Vendido';
        this.actualizarEstadoPedido(pedido);
        break;
    }

  }
  actualizarEstadoPedido(pedido) {
    this.empleadoService.actualizarEstado(pedido).subscribe(
      (pedidoActualizado) => {
        if (pedidoActualizado.status == 'Finalizado') {
          this.obtenerPedidos();
        }
      },
      () => {
      }
    );
  }
  actualizarEstadoFotografo() {
    if (this.pedidos.length == 0) {
      this.empleadoService.actualizarEstadoFotografo(this.authService.getIdUsuario()).subscribe(
        () => {

        },
        (err) => {
          this.toastr.error(err.error.detalles, err.error.titulo)
        }
      );
    }
  }
  obtenerPedidos() {
    this.cargandoPedidos = true;
    this.empleadoService.obtenerPedidosEnProceso(this.authService.getIdUsuario()).subscribe(
      (pedidos) => {
        this.pedidos = pedidos[0].pedido;
        this.cargandoPedidos = false;
      },
      (err) => {
        this.toastr.info('', 'No hay pedidos en proceso', {
          closeButton: true
        })
        this.pedidos = [];
        this.actualizarEstadoFotografo();
        this.cargandoPedidos = false;
      }
    );
  }
  verDetalles(pedido) {
    this.empleadoService.obtenerProductosPorPedido(pedido._id).subscribe(
      (productos) => {
        pedido.productos = productos;
        const dialogRef = this.dialog.open(DetallesProductoComponent, {
          width: '60%',
          data: { pedido, tipo: 0 }
        });
      },
      () => {

      }
    );
  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
  }

}
