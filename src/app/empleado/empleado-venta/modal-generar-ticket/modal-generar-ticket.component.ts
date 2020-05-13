import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido, ProductoPedido } from 'src/app/comun/modelos/pedido.model';
import { Producto } from 'src/app/comun/modelos/producto.model';

export interface DialogData {
  pedido: Pedido;
}
export class Agrupados {
  cantidad: number;
  descripcion: string;
  total: number;
  constructor(cantidad,descripcion,total) {
    this.cantidad = cantidad;
    this.descripcion = descripcion;
    this.total = total;
  }
}
@Component({
  selector: 'app-modal-generar-ticket',
  templateUrl: './modal-generar-ticket.component.html',
  styleUrls: ['./modal-generar-ticket.component.scss']
})
export class ModalGenerarTicketComponent implements OnInit {
  tabla_productos: ProductoPedido[];
  dataSource: any;
  columnas_tabla: string[] = ['descripcion', 'precio'];
  debe: number = 0;
  constructor(public dialogRef: MatDialogRef<ModalGenerarTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
  async ngOnInit() {
    this.tabla_productos = this.data.pedido.productos;
    this.dataSource = this.tabla_productos;
    await this.delay(100);
    var botonImprimir = document.getElementById('botonImprimir');
    botonImprimir.click();
    this.dialogRef.close();
    this.debe = <number>this.data.pedido.total - <number>this.data.pedido.anticipo;
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  public pagado(): boolean{
    if((<number>this.data.pedido.total - <number>this.data.pedido.anticipo) == 0 ) return true;
    return false;
  }
}
