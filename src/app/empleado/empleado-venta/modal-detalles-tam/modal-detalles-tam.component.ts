import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductosService } from 'src/app/comun/servicios/productos.service';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { Error } from '../empleado-venta.component';

export interface DialogData{
  ancho: number,
  alto: number
}
@Component({
  selector: 'app-modal-detalles-tam',
  templateUrl: './modal-detalles-tam.component.html',
  styleUrls: ['./modal-detalles-tam.component.scss']
})
export class ModaDetallesTamComponent implements OnInit {
  buscador: boolean = false;
  productoBuscar: any;
  productosEncontrados: Producto;
  error: Error;
  constructor(
    public dialogRef: MatDialogRef<ModaDetallesTamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private productoService: ProductosService
  ) {
    this.productoBuscar = new Producto();
    
   }

  ngOnInit() {
    this.buscar();
  }
  onNoClick(): void {
    this.productoBuscar = null;
    this.dialogRef.close();
  }
  buscar(){
    this.productosEncontrados = null;
    this.error = null;
    this.buscador = true;
    this.productoService.buscarProductoPorTam(this.data.ancho, this.data.alto).subscribe(
      (productos)=>{
        this.productosEncontrados = productos;
        this.buscador = false;
      },
      (err)=>{
        this.error = err.error;
        this.buscador = false;
      }
    );
  }

}
