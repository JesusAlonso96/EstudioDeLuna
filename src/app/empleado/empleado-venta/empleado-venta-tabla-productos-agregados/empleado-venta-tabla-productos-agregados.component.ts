import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Producto } from 'src/app/comun/modelos/producto.model';

@Component({
  selector: 'app-empleado-venta-tabla-productos-agregados',
  templateUrl: './empleado-venta-tabla-productos-agregados.component.html',
  styleUrls: ['./empleado-venta-tabla-productos-agregados.component.scss']
})
export class EmpleadoVentaTablaProductosAgregadosComponent implements OnInit {
  @Input() productosAgregados: Producto[];
  @Output() quitarProductoEvento = new EventEmitter(true);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginador: MatPaginator;
  datosProductos: MatTableDataSource<Producto>;
  columnas: string[] = ['nombre', 'num_fotos', 'precio', 'borrar']
  constructor() { }

  ngOnInit(): void {
    this.inicializarTabla();
  }
  inicializarTabla() {
    this.datosProductos = new MatTableDataSource(this.productosAgregados);
    this.datosProductos.paginator = this.paginador;
  }
  obtenerTotalPedido(): number {
    return this.productosAgregados.map(producto => producto.precio).reduce((acumulador, valor) => acumulador + valor, 0);
  }
  eliminarProducto(producto: Producto){
    this.quitarProductoEvento.emit(producto);
  }
}
