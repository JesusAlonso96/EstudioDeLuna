import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import * as momento from 'moment';

@Component({
  selector: 'app-modal-confirmar-compra',
  templateUrl: './modal-confirmar-compra.component.html',
  styleUrls: ['./modal-confirmar-compra.component.scss']
})
export class ModalConfirmarCompraComponent {
  constructor(public dialogRef: MatDialogRef<ModalConfirmarCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public pedido: Pedido) { }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
