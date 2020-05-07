import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { EmpleadoService } from 'src/app/empleado/servicio-empleado/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { SeleccionarEmpleadoComponent } from 'src/app/comun/componentes/modales/seleccionar-empleado/seleccionar-empleado.component';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { DetallesProductoComponent } from 'src/app/comun/componentes/modales/detalles-producto/detalles-producto.component';

@Component({
  selector: 'app-pedidos-cola',
  templateUrl: './pedidos-cola.component.html',
  styleUrls: ['./pedidos-cola.component.scss']
})
export class PedidosColaComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() cargandoEvento = new EventEmitter(true);
  pedidos: Pedido[];
  pedidoSeleccionado: Pedido;
  empleadoSeleccionado: Usuario;
  listData: MatTableDataSource<Pedido>
  displayedColumns: string[] = ['num_pedido', 'status', 'fecha_entrega', 'total', 'anticipo', 'asignar', 'verDetalles'];
  asignar: boolean = false;

  constructor(private empleadoService: EmpleadoService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerPedidosEnCola();
  }
  obtenerPedidosEnCola() {
    this.cargandoEv(true,'Obteniendo pedidos...');
    this.empleadoService.obtenerPedidosEnCola().subscribe(
      (pedidos: Pedido[]) => {
        this.cargandoEv(false);
        this.pedidos = pedidos;
        console.log(this.pedidos);
        this.inicializarTabla(this.pedidos);
      },
      (err) => {
        this.cargandoEv(false);
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
    this.cargandoEv(true,'Asignando pedido...');
    this.empleadoService.tomarPedido(this.pedidoSeleccionado._id, <string>this.empleadoSeleccionado._id).subscribe(
      (pedidos: Pedido[]) => {
        this.cargandoEv(false);
        this.pedidos = pedidos;
        this.listData.data = this.pedidos;
        this.toastr.success('Pedido asignado exitosamente', '', { closeButton: true });
        this.eliminarAsignacion();
      },
      (err) => {
        this.cargandoEv(false);
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  cargandoEv(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto: '' });
  }
}
