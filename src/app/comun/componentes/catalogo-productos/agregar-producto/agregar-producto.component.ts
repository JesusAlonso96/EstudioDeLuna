import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { Animaciones } from 'src/app/comun/constantes/animaciones';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss'],
  animations:[Animaciones.carga]
})
export class AgregarProductoComponent implements OnInit {

  producto: Producto = new Producto();
  caracteristicas: boolean = false;
  caracteristica: string = '';
  tam: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AgregarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.producto.familia = data;
    this.producto.activo = 1;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  agregarProducto() {
    console.log(this.producto)
  }
  agregarCaracteristica() {
    this.producto.caracteristicas.push(this.caracteristica);
    this.caracteristica = '';
  }
  limpiarCampoCaracteristica() {
    this.caracteristica = '';
  }
  quitarCaracteristica(indice) {
    this.producto.caracteristicas.splice(indice, 1)
  }
  estaVaciaCaracteristica() {
    return true ? this.caracteristica == '' : false;
  }
}
