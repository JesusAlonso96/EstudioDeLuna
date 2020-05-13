import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { ProductosService } from 'src/app/comun/servicios/productos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatDialog } from '@angular/material';
import { ProductoCot } from 'src/app/comun/modelos/producto_cot.model';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import { CotizacionAdministrarProductosComponent } from '../cotizacion-administrar-productos/cotizacion-administrar-productos.component';

@Component({
  selector: 'app-cotizacion-lista-productos',
  templateUrl: './cotizacion-lista-productos.component.html',
  styleUrls: ['./cotizacion-lista-productos.component.scss'],
  animations: [Animaciones.carga]
})
export class CotizacionListaProductosComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() productos: ProductoCot[];
  @Input() productosCotizacion: ProductoCot[];
  @Output() productoAgregadoEvento = new EventEmitter(true);
  @Output() productoEliminadoEvento = new EventEmitter(true);
  columnas: string[] = ['producto', 'acciones'];
  cargando: boolean = false;
  datosTabla: MatTableDataSource<any>;
  constructor(
    private toastr: NgToastrService,
    private modal: MatDialog) { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.inicializarTablas();
  }
  inicializarTablas() {
    this.datosTabla = new MatTableDataSource(this.productos);
    this.datosTabla.paginator = this.paginator;
  }
  agregarCantidadProducto(producto: ProductoCot) {
    producto.cantidad += 1;
    this.productosCotizacion.push(producto);
  }
  existeProducto(producto: ProductoCot): boolean {
    for (let i = 0; i < this.productosCotizacion.length; i++) {
      if (producto.producto._id == this.productosCotizacion[i].producto._id) return true;
    }
    return false;
  }
  verAdministracionProductos() {
    this.modal.open(CotizacionAdministrarProductosComponent, {
      data: this.productosCotizacion,
      disableClose: true
    });
  }
}
