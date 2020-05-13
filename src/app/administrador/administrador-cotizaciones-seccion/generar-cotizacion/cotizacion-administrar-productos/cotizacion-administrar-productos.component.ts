import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductoCot } from 'src/app/comun/modelos/producto_cot.model';

@Component({
  selector: 'app-cotizacion-administrar-productos',
  templateUrl: './cotizacion-administrar-productos.component.html',
  styleUrls: ['./cotizacion-administrar-productos.component.scss']
})
export class CotizacionAdministrarProductosComponent implements OnInit {
  @Output() productoAgregadoEvento = new EventEmitter(true);
  @Output() productoEliminadoEvento = new EventEmitter(true);
  
  constructor(public modalRef: MatDialogRef<CotizacionAdministrarProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public productos: ProductoCot[]) { }

  ngOnInit(): void {
  }
  cerrarModal() {
    this.modalRef.close(this.productos);
  }
  agregarCantidadProducto(producto: ProductoCot) {
    producto.cantidad += 1;
    this.agregarProducto(producto);
  }
  quitarCantidadProducto(producto: ProductoCot) {
    producto.cantidad -= 1;
    this.quitarProducto(producto);
  }
  agregarProducto(productoCot: ProductoCot) {
    if (productoCot.cantidad == 1) {
      if (!this.existeEnProductos(productoCot)) {
        this.productos.push(productoCot);
      }
    }
  }
  quitarProducto(productoCot: ProductoCot) {
    if (productoCot.cantidad == 0) {
      const indice = this.productos.indexOf(productoCot);
      this.productos.splice(indice, 1);
    }
  }
  totalCotizacion(): number {
    let total: number = 0;
    this.productos.forEach((producto)=>{
      total = total + (producto.cantidad * producto.precioUnitario);
    })
    return total;
  }
  existeEnProductos(producto: ProductoCot): boolean {
    for (let i = 0; i < this.productos.length; i++) {
      if (producto.producto._id == this.productos[i].producto._id) return true;
    }
    return false;
  }
}
