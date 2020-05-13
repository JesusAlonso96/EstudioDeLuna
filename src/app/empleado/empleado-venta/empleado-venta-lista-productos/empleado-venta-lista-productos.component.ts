import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { ProductosService } from 'src/app/comun/servicios/productos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatDialog } from '@angular/material';
import { Modal } from '../empleado-venta.component';
import { TemasService } from 'src/app/comun/servicios/temas.service';
import { ModalDetallesProductoComponent } from '../modal-detalles-producto/modal-detalles-producto.component';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { ModaDetallesTamComponent } from '../modal-detalles-tam/modal-detalles-tam.component';
import { ProductoPedido } from 'src/app/comun/modelos/pedido.model';

@Component({
  selector: 'app-empleado-venta-lista-productos',
  templateUrl: './empleado-venta-lista-productos.component.html',
  styleUrls: ['./empleado-venta-lista-productos.component.scss']
})
export class EmpleadoVentaListaProductosComponent implements OnInit {
  @Input() familia: Familia;
  @Input() productos: ProductoPedido[];
  @Output() cargandoEvento = new EventEmitter(true);
  @Output() productoAgregadoEvento = new EventEmitter(true);

  productosAgrupados: any[] = [];
  cargando: boolean = false;

  constructor(private productosService: ProductosService,
    private toastr: NgToastrService,
    private modal: MatDialog,
    private temasService: TemasService) { }

  ngOnInit(): void {
    console.log("soy los productosss", this.productos);
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productosAgrupados = [];
    if (this.esFamiliaEspecial()) {
      if (this.familia.nombre == 'Sesiones') {
        this.obtenerProductosPorTam();
      } else {
        this.obtenerProductosEspeciales();
      }
    } else {
      this.obtenerProductosPorCantidad();
    }
  }
  esFamiliaEspecial(): boolean {
    if (this.familia.nombre == 'Filiacion' || this.familia.nombre == 'Pasaporte' || this.familia.nombre == 'Visas' || this.familia.nombre == 'Universidades' || this.familia.nombre == 'Sesiones' || this.familia.nombre == 'Instituciones' || this.familia.nombre == 'Combinadas') return true;
    return false;
  }
  obtenerProductosPorTam() {
    this.cargandoProductos(true, 'Cargando productos...');
    this.productosService.obtenerProductosPorTam(this.familia._id).subscribe(
      (productos: any) => {
        this.cargandoProductos(false);
        this.productosAgrupados = productos;
      },
      (err: HttpErrorResponse) => {
        this.cargandoProductos(false);
        this.toastr.abrirToastr('exito', err.error.titulo, err.error.detalles);
      }
    );
  }
  obtenerProductosEspeciales() {
    this.cargandoProductos(true, 'Cargando productos...');
    this.productosService.obtenerProductos(this.familia._id).subscribe(
      (productos: any) => {
        this.cargandoProductos(false);
        this.productosAgrupados = productos;
      },
      (err: HttpErrorResponse) => {
        this.cargandoProductos(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  obtenerProductosPorCantidad() {
    this.cargandoProductos(true, 'Cargando productos...');
    this.productosService.obtenerProductosPorCantidad(this.familia._id).subscribe(
      (productos: any) => {
        this.cargandoProductos(false);
        this.productosAgrupados = productos;
      },
      (err: HttpErrorResponse) => {
        this.cargandoProductos(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  cargandoProductos(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
  agregarProducto(producto: Producto) {
    this.productoAgregadoEvento.emit(producto);
  }
  /* Modales */
  abrirSeleccionarProductos(num_fotos: number) {
    const referenciaModal = this.modal.open(Modal, {
      data: { num: num_fotos, familia: this.familia.nombre, productosActuales: this.productos },
      disableClose: true
    })
    referenciaModal.afterClosed().subscribe(producto => {
      if (producto) {
        this.productoAgregadoEvento.emit(producto);
      }
    })
  }
  verDetalles(producto: Producto) {
    this.modal.open(ModalDetallesProductoComponent, {
      data: { producto }
    });
  }
  abrirModalTamano(ancho: number, alto: number) {
    const referenciaModal = this.modal.open(ModaDetallesTamComponent, {
      data: { ancho: ancho, alto: alto }
    });
    referenciaModal.afterClosed().subscribe(producto => {
      if (producto) {
        this.productoAgregadoEvento.emit(producto);
      }
    })
  }
}
