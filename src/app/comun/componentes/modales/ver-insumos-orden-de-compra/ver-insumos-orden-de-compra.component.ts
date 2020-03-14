import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductoOrdenCompra } from 'src/app/comun/modelos/orden_compra.model';

@Component({
  selector: 'app-ver-insumos-orden-de-compra',
  templateUrl: './ver-insumos-orden-de-compra.component.html',
  styleUrls: ['./ver-insumos-orden-de-compra.component.scss']
})
export class VerInsumosOrdenDeCompraComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<VerInsumosOrdenDeCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public productos: ProductoOrdenCompra[]) { }

  ngOnInit() {
  }

  onNoClick(){
    this.dialogRef.close();
  }
}
