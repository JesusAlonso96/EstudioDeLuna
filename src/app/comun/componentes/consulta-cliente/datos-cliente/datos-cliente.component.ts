import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Cliente } from 'src/app/comun/modelos/cliente.model';
import { PedidosClienteComponent } from './pedidos-cliente/pedidos-cliente.component';

@Component({
  selector: 'app-datos-cliente',
  templateUrl: './datos-cliente.component.html',
  styleUrls: ['./datos-cliente.component.scss']
})
export class DatosClienteComponent implements OnInit {
  usernameVacio: string = 'Sin nombre de usuario';
  sinRazonSocial: string = 'Sin razon social';
  sinRfc: string = 'Sin RFC';
  sinNumInt: string = 'Sin numero interior'
  constructor(public dialogRef: MatDialogRef<DatosClienteComponent>, @Inject(MAT_DIALOG_DATA) public data: Cliente, private dialog: MatDialog) { }



  ngOnInit() {
    console.log(this.data);
  }
  verPedidosCliente(clienteId: string) {
    this.dialog.open(PedidosClienteComponent, { data: clienteId, width: '90%' });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
