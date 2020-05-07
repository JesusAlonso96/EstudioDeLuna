import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { ProductosService } from 'src/app/comun/servicios/productos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { ProductoCot } from 'src/app/comun/modelos/producto_cot.model';
import { Animaciones } from 'src/app/comun/constantes/animaciones';

@Component({
  selector: 'app-cotizacion-lista-productos',
  templateUrl: './cotizacion-lista-productos.component.html',
  styleUrls: ['./cotizacion-lista-productos.component.scss'],
  animations: [Animaciones.deslizar],
  host: { '(document:click)': 'eventoClickPanel($event)' }
})
export class CotizacionListaProductosComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() productos: ProductoCot[];
  @Input() productosCotizacion: ProductoCot[];
  @Output() productoAgregadoEvento = new EventEmitter(true);
  columnas: string[] = ['producto', 'acciones'];
  cargando: boolean = false;
  mostrarAdministracion: string = 'cerrado';
  datosTabla: MatTableDataSource<any>;
  constructor(
    private toastr: NgToastrService) { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    console.log(this.productos)
    this.inicializarTabla();
  }
  inicializarTabla() {
    this.datosTabla = new MatTableDataSource(this.productos);
    this.datosTabla.paginator = this.paginator;
  }
  agregarCantidadProducto(producto: ProductoCot) {
    producto.cantidad += 1;
    this.productoAgregadoEvento.emit(producto);
  }
  existeProducto(producto: ProductoCot): boolean {
    for (let i = 0; i < this.productosCotizacion.length; i++) {
      if (producto.producto._id == this.productosCotizacion[i].producto._id) return true;
    }
    return false;
  }
  eventoClickPanel(evento: MouseEvent) {
    console.log(evento.srcElement);
    if (this.mostrarAdministracion == 'abierto' && evento.target != document.getElementById('administrarProductos') && evento.target != document.getElementById('toggleAdministracion')) {
      console.log("entre a cerrarlo");
      this.mostrarAdministracion = 'cerrado';
    }

  }
  verAdministracionProductos() {
    console.log("entre ala funcion")
    this.mostrarAdministracion = this.mostrarAdministracion == 'abierto' ? 'cerrado' : 'abierto';
  }
}
