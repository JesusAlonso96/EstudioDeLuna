import { Component, Inject } from '@angular/core';
import { ProductoProveedor } from 'src/app/comun/modelos/producto_proveedor.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-editar-producto-proveedor',
  templateUrl: './editar-producto-proveedor.component.html',
  styleUrls: ['./editar-producto-proveedor.component.scss']
})
export class EditarProductoProveedorComponent {

  constructor(public dialogRef: MatDialogRef<EditarProductoProveedorComponent>, @Inject(MAT_DIALOG_DATA) public producto: ProductoProveedor) {
    console.log(this.producto);
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
