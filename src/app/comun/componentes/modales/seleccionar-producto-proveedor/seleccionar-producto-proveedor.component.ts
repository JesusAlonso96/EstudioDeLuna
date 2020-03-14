import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductoOrdenCompra } from 'src/app/comun/modelos/orden_compra.model';

@Component({
  selector: 'app-seleccionar-producto-proveedor',
  templateUrl: './seleccionar-producto-proveedor.component.html',
  styleUrls: ['./seleccionar-producto-proveedor.component.scss']
})
export class SeleccionarProductoProveedorComponent implements OnInit {
  editarManual: boolean = false; 
  constructor(
    public dialogRef: MatDialogRef<SeleccionarProductoProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public productos: ProductoOrdenCompra[]) { }

  ngOnInit() {
  }
  agregarCantidadProducto(producto: ProductoOrdenCompra) {
    producto.cantidadOrden += 1;
  }

  quitarCantidadProducto(producto: ProductoOrdenCompra) {
    producto.cantidadOrden -= 1;
  }
  cantidadEnCero(producto: ProductoOrdenCompra): boolean {
    return producto.cantidadOrden == 0 ? true : false;
  }
  obtenerProductosValidos(): ProductoOrdenCompra[]{
    let productosValidos: ProductoOrdenCompra[] = [];
    for(let producto of this.productos){
      if(producto.cantidadOrden !== 0) productosValidos.push(producto);
    }
    return productosValidos;
  }

  aceptarProductos() {
    this.productos = this.obtenerProductosValidos();
    this.dialogRef.close(this.productos);
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
