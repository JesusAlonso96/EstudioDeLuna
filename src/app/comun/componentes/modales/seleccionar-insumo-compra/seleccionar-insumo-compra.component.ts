import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InsumoCompra } from 'src/app/comun/modelos/compra.model';

@Component({
  selector: 'app-seleccionar-insumo-compra',
  templateUrl: './seleccionar-insumo-compra.component.html',
  styleUrls: ['./seleccionar-insumo-compra.component.scss']
})
export class SeleccionarInsumoCompraComponent implements OnInit {
  editarManual: boolean = false;
  constructor(public dialogRef: MatDialogRef<SeleccionarInsumoCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public productos: InsumoCompra[]) { }

  ngOnInit() {
  }

  agregarCantidadProducto(producto: InsumoCompra) {
    producto.cantidad = producto.cantidad + 1;
    console.log(producto.cantidad)
    producto.subtotal = producto.subtotal +  producto.insumo.costo;
  }

  quitarCantidadProducto(producto: InsumoCompra) {
    producto.cantidad = producto.cantidad - 1;
    producto.subtotal = producto.subtotal - producto.insumo.costo;
  }
  cambiarSubtotal(producto: InsumoCompra){
    producto.subtotal = producto.cantidad * producto.insumo.costo;
  }
  cantidadEnCero(producto: InsumoCompra): boolean {
    return producto.cantidad == 0 ? true : false;
  }
  obtenerProductosValidos(): InsumoCompra[]{
    let productosValidos: InsumoCompra[] = [];
    for(let producto of this.productos) {
      if(producto.cantidad !== 0) productosValidos.push(producto);
    }
    return productosValidos;
  }
  aceptarProductos(){
    this.productos = this.obtenerProductosValidos();
    this.dialogRef.close(this.productos);
  }
  onNoClick() {
    this.dialogRef.close();
  }

}
