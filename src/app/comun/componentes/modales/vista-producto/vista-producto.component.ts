import { Component, OnInit, Inject } from '@angular/core';
import { ProductoPedido } from 'src/app/comun/modelos/pedido.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DetallesProductoComponent } from '../detalles-producto/detalles-producto.component';

@Component({
  selector: 'app-vista-producto',
  templateUrl: './vista-producto.component.html',
  styleUrls: ['./vista-producto.component.scss']
})
export class VistaProductoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<VistaProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public producto: ProductoPedido
  ) { }

  ngOnInit(): void {
  }
  cerrarModal(): void {
    this.dialogRef.close();
  }

}
