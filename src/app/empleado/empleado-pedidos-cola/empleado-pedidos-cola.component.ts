import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { ConfirmarModalComponent } from './confirmar-modal/confirmar-modal.component';
import { ToastrService } from 'ngx-toastr';
import { PedidosService } from '../servicio-empleado/pedidos.service';

@Component({
  selector: 'app-empleado-pedidos-cola',
  templateUrl: './empleado-pedidos-cola.component.html',
  styleUrls: ['./empleado-pedidos-cola.component.scss']
})
export class EmpleadoPedidosColaComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  parametroBusqueda: string;
  pedidos: Pedido[] = [];
  listData: MatTableDataSource<any>
  cargando: boolean = false;
  displayedColumns: string[] = ['acciones', 'num_pedido', 'status', 'fecha_entrega', 'total', 'anticipo']
  constructor(public dialog: MatDialog, private empleadoService: EmpleadoService, private autService: ServicioAutenticacionService, private toastr: ToastrService, private pedidosService: PedidosService) { }
  ngOnInit() {
    this.obtenerPedidosEnCola();
    this.obtenerPedidosEnColaTiempoReal();
    this.quitarPedidoEnTiempoReal();
  }
  obtenerPedidosEnCola() {
    this.empleadoService.obtenerPedidosEnCola().subscribe(
      (pedidos: Pedido[]) => {
        this.pedidos = pedidos;
        this.inicializarTabla();
      },
      (err: any) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerPedidosEnColaTiempoReal() {
    this.pedidosService.obtenerNuevoPedidoEnCola().subscribe(
      (pedido: Pedido) => {
        this.pedidos.push(pedido);
        this.listData.data = this.pedidos;
      }
    );
  }
  quitarPedidoEnTiempoReal() {
    this.pedidosService.quitarPedidoEnCola().subscribe(
      (pedido: Pedido) => {
        const indice = this.pedidos.indexOf(pedido);
        this.pedidos.splice(indice, 1);
        if (pedido.fotografo._id !== this.autService.getIdUsuario()) {
          this.toastr.info(`El pedido ${pedido.num_pedido} fue tomado por ${pedido.fotografo.nombre}`, 'Pedido tomado', { closeButton: true });
        }
      }
    );
  }
  confirmarTomaPedido(pedido: Pedido) {
    const dialogRef = this.dialog.open(ConfirmarModalComponent);
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) this.tomarPedido(pedido);
    })
  }
  tomarPedido(pedido: Pedido) {
    this.cargando = true;
    this.empleadoService.tomarPedido(pedido._id, this.autService.getIdUsuario()).subscribe(
      (pedidos: Pedido[]) => {
        this.pedidos = pedidos;
        this.listData.data = this.pedidos;
        this.cargando = false;
        this.toastr.success('Ve a la pestaña de Pedidos en proceso para ver el pedido', 'Pedido tomado con exito', { closeButton: true });
        this.empleadoService.eliminarNotificacionPorPedido(pedido.num_pedido).subscribe();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
    this.aplicarFiltro();
  }
  aplicarFiltro() {
    this.listData.filter = this.parametroBusqueda.trim().toLocaleLowerCase();
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.pedidos);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (pedido: Pedido, filtro: string) => {
      return !filtro || pedido.num_pedido.toString().indexOf(filtro) !== -1;
    }
  }
}
