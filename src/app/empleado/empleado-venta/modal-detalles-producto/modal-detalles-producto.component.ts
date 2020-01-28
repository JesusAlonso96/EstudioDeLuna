import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ModalDatos{
  producto:any;
}

@Component({
  selector: 'app-modal-detalles-producto',
  templateUrl: './modal-detalles-producto.component.html',
  styleUrls: ['./modal-detalles-producto.component.scss']
})
export class ModalDetallesProductoComponent {

  buscador: boolean = false;
  productoBuscar: any;
  error: Array<any>;
  constructor(
    public dialogRef: MatDialogRef<ModalDetallesProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalDatos) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
