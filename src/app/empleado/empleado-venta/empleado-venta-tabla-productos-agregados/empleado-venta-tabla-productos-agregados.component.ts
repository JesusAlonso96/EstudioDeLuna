import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { ProductoPedido } from 'src/app/comun/modelos/pedido.model';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-empleado-venta-tabla-productos-agregados',
  templateUrl: './empleado-venta-tabla-productos-agregados.component.html',
  styleUrls: ['./empleado-venta-tabla-productos-agregados.component.scss']
})
export class EmpleadoVentaTablaProductosAgregadosComponent implements OnInit {
  @Input() productosAgregados: ProductoPedido[];
  @Output() quitarProductoEvento = new EventEmitter(true);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginador: MatPaginator;
  datosProductos: MatTableDataSource<ProductoPedido>;
  columnas: string[] = ['nombre', 'num_fotos', 'precio', 'administrar']
  constructor(private modal: MatDialog) { }

  ngOnInit(): void {
    this.inicializarTabla();
  }
  inicializarTabla() {
    console.log(this.productosAgregados);
    this.datosProductos = new MatTableDataSource(this.productosAgregados);
    this.datosProductos.paginator = this.paginador;
  }
  obtenerTotalPedido(): number {
    let total: number = 0;
    this.productosAgregados.forEach((producto) => {
      total = total + (producto.cantidad * producto.precioUnitario);
    })
    return total;
  }
  agregarProducto(producto: ProductoPedido) {
    producto.cantidad += 1;
    if (producto.cantidad == 1) {
      if (!this.existeEnProductos(producto)) {
        this.productosAgregados.push(producto);
      }
    }
  }
  quitarProducto(producto: ProductoPedido) {
    producto.cantidad -= 1;
    if (producto.cantidad == 0) {
      const referenciaModal = this.modal.open(ModalConfirmacionComponent, {
        data: { titulo: 'Quitar producto', mensaje: '¿Desea quitar este producto del pedido?', msgBoton: 'Quitar', color: 'primary' }
      })
      referenciaModal.afterClosed().subscribe(respuesta => {
        if (respuesta) {
          const indice = this.productosAgregados.indexOf(producto);
          this.productosAgregados.splice(indice, 1);
          this.datosProductos.data = this.productosAgregados;
        } else producto.cantidad += 1;
      })

    }
  }
  existeEnProductos(producto: ProductoPedido): boolean {
    for (let i = 0; i < this.productosAgregados.length; i++) {
      if (producto.producto._id == this.productosAgregados[i].producto._id) return true;
    }
    return false;
  }
}
