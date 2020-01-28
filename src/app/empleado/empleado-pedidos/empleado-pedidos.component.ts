import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { PageEvent, MatDialog } from '@angular/material';
import { PedidoEstadoComponent } from './pedido-estado/pedido-estado.component';
@Component({
  selector: 'app-empleado-pedidos',
  templateUrl: './empleado-pedidos.component.html',
  styleUrls: ['./empleado-pedidos.component.scss']
})
export class EmpleadoPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  cargando: boolean = false;
  parametroBusqueda: string = '';
  url_fotos: string = environment.url_fotos;;
  page_size: number = 10;
  page_number: number = 1;
  constructor(public dialog: MatDialog, private empleadoService: EmpleadoService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerPedidos();

  }
  obtenerPedidos() {
    this.cargando = true;
    this.empleadoService.obtenerPedidos().subscribe(
      (pedidos) => {
        this.pedidos = pedidos;
        this.cargando = false;
      },
      (err) => {
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
    const dialogRef = this.dialog.open(PedidoEstadoComponent,{
      width:'60%',
      data: pedido
    })
    dialogRef.afterClosed().subscribe(actualizar=>{
    
    })
  }

}
