import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { ToastrService } from 'ngx-toastr';
import { SeleccionarEmpleadoComponent } from 'src/app/comun/componentes/modales/seleccionar-empleado/seleccionar-empleado.component';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { DetallesProductoComponent } from 'src/app/comun/componentes/modales/detalles-producto/detalles-producto.component';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-pedidos-cola',
  templateUrl: './pedidos-cola.component.html',
  styleUrls: ['./pedidos-cola.component.scss']
})
export class PedidosColaComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pedidos: Pedido[];
  pedidoSeleccionado: Pedido;
  empleadoSeleccionado: Usuario;
  listData: MatTableDataSource<Pedido>
  displayedColumns: string[] = ['num_pedido', 'status', 'fecha_entrega', 'total', 'anticipo', 'asignar', 'verDetalles'];
  asignar: boolean = false;

  constructor(private pedidosService: PedidosService, 
    private toastr: NgToastrService, 
    private cargandoService: CargandoService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerPedidosEnCola();
  }
  obtenerPedidosEnCola() {
    this.cargandoService.crearVistaCargando(true,'Obteniendo pedidos...');
    this.pedidosService.obtenerPedidosEnCola().subscribe(
      (pedidos: Pedido[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.pedidos = pedidos;
        this.inicializarTabla(this.pedidos);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );
  }
  inicializarTabla(pedidos: Pedido[]) {
    this.listData = new MatTableDataSource(pedidos);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
  }
  asignarPedido(pedido: Pedido) {
    const dialogRef = this.dialog.open(SeleccionarEmpleadoComponent);
    dialogRef.afterClosed().subscribe(empleado => {
      if (empleado) {
        this.empleadoSeleccionado = empleado;
        this.pedidoSeleccionado = pedido;
        this.asignar = true;
      }
    })
  }
  confirmarAsignacion() {
    this.asignarPedidoConfirmado();
  }
  verDetalles(pedido: Pedido) {
    this.dialog.open(DetallesProductoComponent, {
      data: { pedido, tipo: 1 }
    })
  }
  eliminarAsignacion() {
    this.asignar = false;
    this.empleadoSeleccionado = undefined;
    this.pedidoSeleccionado = undefined;
  }
  asignarPedidoConfirmado() {
    this.cargandoService.crearVistaCargando(true,'Asignando pedido...');
    this.pedidosService.tomarPedido(this.pedidoSeleccionado._id, <string>this.empleadoSeleccionado._id).subscribe(
      (pedidos: Pedido[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.pedidos = pedidos;
        this.listData.data = this.pedidos;
        this.toastr.abrirToastr('exito','','Pedido asignado exitosamente');
        this.eliminarAsignacion();
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );
  }
}
