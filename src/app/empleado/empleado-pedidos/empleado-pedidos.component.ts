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
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

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
  fechaPedidos: number = 2;
  nombreFiltroActual: string = 'Pedidos esta semana';
  constructor(public dialog: MatDialog, private pedidosService: PedidosService, 
    private toastr: NgToastrService, 
    private cargandoService: CargandoService,
    private temasService: TemasService) { }

  ngOnInit() {
    this.obtenerPedidos(this.fechaPedidos);
  }
  obtenerPedidos(filtro: number) {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo pedidos');
    this.pedidosService.obtenerPedidos(filtro).subscribe(
      (pedidos: Pedido[]) => {
        this.pedidos = this.pedidosFiltrados = pedidos;
        this.cargando = this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.toastr.error(err.error.detalles, err.error.titulo);
        this.cargando = this.cargandoService.crearVistaCargando(false);
      }
    );
  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
    this.aplicarFiltro();
  }
  manejarPaginacion(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  verDetalles(pedido: Pedido) {
    this.dialog.open(PedidoEstadoComponent, { data: pedido, disableClose: true })
  }
  aplicarFiltro() {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      return (pedido.num_pedido.toString().trim().toLowerCase().indexOf(this.parametroBusqueda.trim().toLowerCase()) !== -1);
    })
  }
  cambio() {
    switch (this.fechaPedidos) {
      case 1:
        this.nombreFiltroActual = 'Pedidos de hoy';
        this.obtenerPedidos(this.fechaPedidos);
        break;
      case 2:
        this.nombreFiltroActual = 'Pedidos esta semana';
        this.obtenerPedidos(this.fechaPedidos);
        break;
      case 3:
        this.nombreFiltroActual = 'Pedidos este mes';
        this.obtenerPedidos(this.fechaPedidos);
        break;
      case 4:
        this.nombreFiltroActual = 'Pedidos en 3 meses';
        this.obtenerPedidos(this.fechaPedidos);
        break;
      case 5:
        const referenciaModal = this.dialog.open(ModalConfirmacionComponent, {
          data: {
            titulo: '¿Estas seguro que deseas ver todos los pedidos?',
            mensaje: ' Esta busqueda podria demorar algunos minutos',
            msgBoton: 'Buscar',
            color: 'primary'
          }
        })
        referenciaModal.afterClosed().subscribe(buscar => {
          if (buscar) this.obtenerPedidos(this.fechaPedidos);
          else {
            this.fechaPedidos = 2;
            this.obtenerPedidos(this.fechaPedidos);
          }
        })
        break;
    }

  }

}
