import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from '../../servicio-empleado/empleado.service';
import { ModalGenerarTicketComponent } from '../../empleado-venta/modal-generar-ticket/modal-generar-ticket.component';

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
  debe: number;
  input: boolean = false;
  inputDebe: number;
  metodoPago: string = '';
  constructor(public matDialog: MatDialog,
    public dialogRef: MatDialogRef<PedidoEstadoComponent>, @Inject(MAT_DIALOG_DATA) public data: Pedido, private toastr: ToastrService, private empleadoService: EmpleadoService) { }
  ngOnInit() {
    console.log(this.data)
    this.inputDebe = 0;
    this.obtenerProductos();
    this.crearRuta();
    this.inicializarPago();
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
  inicializarPago() {
    this.debe = <number>this.data.total - <number>this.data.anticipo;
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
  marcarEntregado() {
    if (this.data.c_retoque) {

    }
    if (this.montoCumplido2()) {
      this.data.status = 'Vendido';
      this.empleadoService.actualizarEstado(this.data).subscribe();
      if (this.data.c_retoque) {
        this.crearVenta(this.data, this.inputDebe, <string>this.data.metodoPago);
      }
      this.toastr.success('Pedido actualizado y vendido');
      this.matDialog.open(ModalGenerarTicketComponent,
        {
          data: { pedido: this.data }
        })
      this.onNoClick();
    } else if (this.montoCumplido()) {
      let pago = this.inputDebe + <number>this.data.anticipo;
      this.data.anticipo = pago;
      this.empleadoService.actualizarAnticipo(this.data._id, this.data.anticipo).subscribe()
      this.data.status = 'Vendido';
      this.empleadoService.actualizarEstado(this.data).subscribe()
      this.toastr.success('Pedido actualizado y vendido');
      this.crearVenta(this.data, this.inputDebe, this.metodoPago);
    } else {
      this.toastr.info('Por favor cubre el monto del pedido');
    }

  }
  montoCumplido2() {
    if (this.data.anticipo < this.data.total) {
      return false;
    }
    return true;
  }
  montoCumplido() {
    if ((this.inputDebe + <number>this.data.anticipo) == this.data.total) {
      this.debe = 0;
      return true;
    }
    this.inicializarPago()
    return false;
  }
  obtenerProductos() {
    this.empleadoService.obtenerProductosPorPedido(this.data._id).subscribe(
      (productos) => {
        this.data.productos = productos;
      }
    );
  }
  crearVenta(pedido: Pedido, debe: Number, metodoPago: string) {
    this.empleadoService.crearVenta(pedido, debe, metodoPago).subscribe(
      () => {
        this.matDialog.open(ModalGenerarTicketComponent,
          {
            data: { pedido: this.data }
          })
        this.onNoClick();
      },
      () => {

      }
    );
  }
}
