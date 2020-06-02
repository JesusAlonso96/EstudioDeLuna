import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { environment } from '../../../../../environments/environment';
export interface Data {
  pedido: Pedido;
  tipo: number;
}
@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.component.html',
  styleUrls: ['./detalles-producto.component.scss']
})
export class DetallesProductoComponent {
  @Input() tipo: number;
  foto: string;
  constructor(
    public dialogRef: MatDialogRef<DetallesProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data) {
    this.foto = environment.url_fotos + this.data.pedido.foto;
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

}
