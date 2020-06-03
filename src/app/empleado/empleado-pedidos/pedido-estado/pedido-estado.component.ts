import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from '../../servicio-empleado/empleado.service';
import { ModalGenerarTicketComponent } from '../../empleado-venta/modal-generar-ticket/modal-generar-ticket.component';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Venta } from 'src/app/comun/modelos/venta.model';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
class Pago {
  metodoPago: string;
  monto: number;
}
@Component({
  selector: 'app-pedido-estado',
  templateUrl: './pedido-estado.component.html',
  styleUrls: ['./pedido-estado.component.scss']
})
export class PedidoEstadoComponent implements OnInit {

  estados_normal = ['En espera', 'En retoque', 'Imprimiendo', 'Cortando fotografias', 'Finalizado', 'Vendido'];
  estados = ['En espera', 'En retoque', 'Imprimiendo', 'Poniendo adherible', 'Cortando fotografias', 'Finalizado', 'Vendido'];
  estadosNuevo = [];
  estadoActual = '';
  debe: number;  //eliminar
  input: boolean = false;
  inputDebe: number;//eliminar
  metodoPago: string = '';
  cantidadRestante: number;
  constructor(public matDialog: MatDialog,
    public dialogRef: MatDialogRef<PedidoEstadoComponent>, @Inject(MAT_DIALOG_DATA) public data: Pedido,
    private toastr: NgToastrService, 
    private empleadoService: EmpleadoService,
    private cargandoService: CargandoService,
    private pedidosService: PedidosService) { }
  ngOnInit() {
    this.cantidadRestante = this.data.total - this.data.anticipo;
    this.obtenerProductos();
    this.crearRuta();
  }
  crearRuta() {
    if (this.data.c_adherible) {
      //crear ruta con estados
      var indice = this.estados.indexOf(<string>this.data.status);
      this.crearBreadCrumb(indice, 1)
    } else {
      var indice = this.estados_normal.indexOf(<string>this.data.status);
      this.crearBreadCrumb(indice, 0)
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  crearBreadCrumb(indice, tipo) {
    for (let i = 0; i <= indice; i++) {
      if (tipo == 0) {
        this.estadosNuevo.push(this.estados_normal[i]);
      } else {
        this.estadosNuevo.push(this.estados[i]);
      }
    }
    this.estadoActual = this.estadosNuevo.pop();
  }

  obtenerProductos() {
    this.pedidosService.obtenerProductosPorPedido(this.data._id).subscribe(
      (productos) => {
        this.data.productos = productos;
      }
    );
  }

  //metodo para pagar pedido sin marcarlo como finalizado
  pagarPedido() {
    this.data.anticipo = this.data.anticipo + this.cantidadRestante;
    this.actualizarAnticipoPedido();
    this.crearVenta(this.data, this.cantidadRestante, this.metodoPago);
  }
  //si esta pagado y esta en finalizado, solo actualizar el estado a entregado
  entregarPedido() {
    this.data.status = 'Vendido';
    this.actualizarEstadoPedido();
  }
  //pagar pedido y actualizar el estado del mismo, crear venta
  pagarYEntregarPedido() {
    this.pagarPedido();
    this.entregarPedido();
  }
  pedidoPagado(): boolean {
    return this.data.total == this.data.anticipo ? true : false;
  }
  actualizarAnticipoPedido() {
    this.cargandoService.crearVistaCargando(true, 'Actualizando el anticipo del pedido...')
    this.pedidosService.actualizarAnticipo(this.data._id, this.data.anticipo).subscribe(
      (pedidoActualizado: Pedido) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', 'El pedido se ha actualizado satisfactoriamente', '');
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  actualizarEstadoPedido() {
    this.cargandoService.crearVistaCargando(true, 'Actualizando el estado del pedido...')
    this.pedidosService.actualizarEstado(this.data).subscribe(
      (pedidoActualizado: Pedido) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', 'El pedido se ha actualizado correctamente', '');
        this.onNoClick();
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    )
  }
  crearVenta(pedido: Pedido, debe: Number, metodoPago: string) {
    this.cargandoService.crearVistaCargando(true, 'Creando venta...')
    this.empleadoService.crearVenta(pedido, debe, metodoPago, localStorage.getItem('c_a')).subscribe(
      (ventaRealizada: Venta) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', 'Se realizo la venta satisfactoriamente', '');
        this.matDialog.open(ModalGenerarTicketComponent,
          {
            data: { pedido: this.data }
          })
        this.onNoClick();
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
}
