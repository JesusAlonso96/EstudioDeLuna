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
  
  fecha_creacion: string;
  fecha_entrega: string;

  constructor(public dialogRef: MatDialogRef<ModalConfirmarCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public pedido: Pedido) {
      this.fecha_creacion = momento(this.pedido.fecha_creacion).locale('es').format('LLLL');
      this.fecha_entrega = momento(this.pedido.fecha_entrega).locale('es').format('LLLL');
     }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
