import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { ConfirmarModalComponent } from './confirmar-modal/confirmar-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empleado-pedidos-cola',
  templateUrl: './empleado-pedidos-cola.component.html',
  styleUrls: ['./empleado-pedidos-cola.component.scss']
})
export class EmpleadoPedidosColaComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  parametroBusqueda: string;
  pedidos: Pedido[];
  listData: MatTableDataSource<any>
  cargando: boolean;
  displayedColumns: string[] = ['acciones','num_pedido', 'status', 'fecha_entrega', 'total', 'anticipo']
  constructor(public dialog: MatDialog, private empleadoService: EmpleadoService, private autService: ServicioAutenticacionService, private toastr: ToastrService) {
    this.pedidos = [];
    this.cargando = false;
  }
  ngOnInit() {
    this.empleadoService.obtenerPedidosEnCola().subscribe(
      (pedidos) => {
        this.pedidos = pedidos;
        this.listData = new MatTableDataSource(this.pedidos);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.filterPredicate = (data, filter) => {
          return !filter || data.num_pedido == filter;
        }
      },
      () => {

      }
    );
  }
  tomarPedido(pedido) {
    const dialogRef = this.dialog.open(ConfirmarModalComponent);
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.cargando = true;
        this.empleadoService.tomarPedido(pedido._id, this.autService.getIdUsuario()).subscribe(
          (pedidos) => {
            this.pedidos = pedidos;
            this.listData.data = this.pedidos;
            this.cargando = false;
            this.toastr.success('Ve a la pestaña de Pedidos en proceso para ver el pedido','Pedido tomado con exito',
            {
              closeButton:true
            })
            this.empleadoService.eliminarNotificacionPorPedido(pedido.num_pedido).subscribe();
          },
          () => {

          }
        );
      }
    })
  }
  borrarBusqueda() {
    this.parametroBusqueda = '';
    this.aplicarFiltro();
  }
  aplicarFiltro() {
    this.listData.filter = this.parametroBusqueda.trim().toLocaleLowerCase();
  }
}
