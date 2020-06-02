import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { DetallesProductoComponent } from 'src/app/comun/componentes/modales/detalles-producto/detalles-producto.component';
import { Pedido, ProductoPedido } from 'src/app/comun/modelos/pedido.model';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';
import { environment } from '../../../environments/environment';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-empleado-pedidos-realizados',
  templateUrl: './empleado-pedidos-realizados.component.html',
  styleUrls: ['./empleado-pedidos-realizados.component.scss']
})
export class EmpleadoPedidosRealizadosComponent implements OnInit {
  status = ['En retoque', 'Imprimiendo', 'Adherible', 'Finalizado', 'Vendido']
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  cargando = {
    cargando: false,
    texto: ''
  };
  url_fotos: string = environment.url_fotos;
  parametroBusqueda: string = '';
  tipoFiltro: number = 3;
  nombreFiltroActual: string = 'Pedidos este mes';

  constructor(
    public dialog: MatDialog, 
    private pedidosService: PedidosService, 
    private autenticacionService: ServicioAutenticacionService, 
    private toastr: NgToastrService,
    private cargandoService: CargandoService) {
  }

  ngOnInit() {
    this.obtenerPedidosRealizados(this.tipoFiltro);
  }
  obtenerPedidosRealizados(tipoFiltro: number) {
    this.pedidos = this.pedidosFiltrados = [];
    this.cargandoService.crearVistaCargando(true, 'Obteniendo pedidos...')
    this.pedidosService.obtenerPedidosRealizados(this.autenticacionService.getIdUsuario(), tipoFiltro).subscribe(
      (pedidos: any[]) => {
        this.pedidos = this.pedidosFiltrados = pedidos[0].pedido;
        this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('info', err.error.detalles, err.error.titulo);
        this.cargandoService.crearVistaCargando(false);
      }
    );
  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
    this.aplicarFiltro();
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
  cambio() {
    switch (this.tipoFiltro) {
      case 1:
        this.nombreFiltroActual = 'Pedidos de hoy';
        this.obtenerPedidosRealizados(this.tipoFiltro);
        break;
      case 2:
        this.nombreFiltroActual = 'Pedidos esta semana';
        this.obtenerPedidosRealizados(this.tipoFiltro);
        break;
      case 3:
        this.nombreFiltroActual = 'Pedidos este mes';
        this.obtenerPedidosRealizados(this.tipoFiltro);
        break;
      case 4:
        this.nombreFiltroActual = 'Pedidos en 3 meses';
        this.obtenerPedidosRealizados(this.tipoFiltro);
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
          if (buscar) this.obtenerPedidosRealizados(this.tipoFiltro);
          else {
            this.tipoFiltro = 2;
            this.obtenerPedidosRealizados(this.tipoFiltro);
          }
        })
        break;
    }
  }
  aplicarFiltro() {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      return (pedido.num_pedido.toString().trim().toLowerCase().indexOf(this.parametroBusqueda.trim().toLowerCase()) !== -1);
    })
  }
}
