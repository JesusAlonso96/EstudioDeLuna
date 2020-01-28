import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { environment } from '../../../environments/environment'
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DetallesProductoComponent } from 'src/app/comun/componentes/modales/detalles-producto/detalles-producto.component';

@Component({
  selector: 'app-empleado-pedidos-realizados',
  templateUrl: './empleado-pedidos-realizados.component.html',
  styleUrls: ['./empleado-pedidos-realizados.component.scss']
})
export class EmpleadoPedidosRealizadosComponent implements OnInit {
  status = ['En retoque', 'Imprimiendo', 'Adherible', 'Finalizado', 'Vendido']
  pedidos: any[];
  cargandoPedidos: boolean;
  url_fotos: string;
  parametroBusqueda: string;
  constructor(public dialog: MatDialog, private empleadoService: EmpleadoService, private autenticacionService: ServicioAutenticacionService, private toastr: ToastrService) {
    this.pedidos = [];
    this.parametroBusqueda = '';
    this.cargandoPedidos = false;
    this.url_fotos = environment.url_fotos;
  }

  ngOnInit() {
    this.cargandoPedidos = true
    this.empleadoService.obtenerPedidosRealizados(this.autenticacionService.getIdUsuario()).subscribe(
      (pedidos) => {
        this.pedidos = pedidos[0].pedido;
        this.cargandoPedidos = false;
      },
      (err) => {
        this.toastr.info(err.error.detalles, err.error.titulo, { closeButton: true });
        this.cargandoPedidos = false;
      }
    );

  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
  }
  verDetalles(pedido) {
    console.log(pedido._id)
    this.empleadoService.obtenerProductosPorPedido(pedido._id).subscribe(
      (productos) => {
        pedido.productos = productos;
        this.dialog.open(DetallesProductoComponent, { width: '60%', data: { pedido, tipo: 0 } });
      }, () => { }
    );
  }
}
