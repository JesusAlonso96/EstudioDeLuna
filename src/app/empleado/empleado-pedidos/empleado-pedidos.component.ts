import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { TemasService } from 'src/app/comun/servicios/temas.service';
import { environment } from '../../../environments/environment';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { PedidoEstadoComponent } from './pedido-estado/pedido-estado.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-empleado-pedidos',
  templateUrl: './empleado-pedidos.component.html',
  styleUrls: ['./empleado-pedidos.component.scss'],
  animations: [Animaciones.carga]
})
export class EmpleadoPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  cargando: boolean = false;
  parametroBusqueda: string = '';
  url_fotos: string = environment.url_fotos;;
  page_size: number = 5;
  page_number: number = 1;
  constructor(public dialog: MatDialog, private empleadoService: EmpleadoService, private toastr: NgToastrService, private temasService: TemasService) { }

  ngOnInit() {
    this.obtenerPedidos();
  }
  obtenerPedidos() {
    this.cargando = true;
    this.empleadoService.obtenerPedidos().subscribe(
      (pedidos: Pedido[]) => {
        this.pedidos = this.pedidosFiltrados = pedidos;
        this.cargando = false;
      },
      (err: HttpErrorResponse) => {
        this.toastr.error(err.error.detalles, err.error.titulo);
        this.cargando = false;
      }
    );
  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
  }
  manejarPaginacion(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  verDetalles(pedido: Pedido) {
    this.dialog.open(PedidoEstadoComponent, { data: pedido, panelClass: this.temasService.obtenerClaseActiva(), disableClose: true })
  }
  aplicarFiltro() {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      return (pedido.num_pedido.toString().trim().toLowerCase().indexOf(this.parametroBusqueda.trim().toLowerCase()) !== -1);
    })
  }

}
