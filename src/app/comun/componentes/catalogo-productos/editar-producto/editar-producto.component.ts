import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/comun/modelos/producto.model';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit {
  producto: Producto = new Producto();
  caracteristicas: boolean = false;
  tam: boolean = false;
  caracteristica: string = '';
  constructor(
    public dialogRef: MatDialogRef<EditarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.producto = data;
    this.tam = this.tieneTam();
    if (!this.tam) {
      this.producto.alto = 0;
      this.producto.ancho = 0;
    }

  }

  ngOnInit() {
  }
  tieneTam(): boolean {
    return true ? this.producto.alto != null && this.producto.ancho != null : false;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  estaVaciaCaracteristica() {
    return true ? this.caracteristica == '' : false;
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
}
