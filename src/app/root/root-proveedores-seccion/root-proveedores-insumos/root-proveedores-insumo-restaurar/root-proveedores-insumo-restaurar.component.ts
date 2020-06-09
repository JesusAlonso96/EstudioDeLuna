import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { ProductoProveedor } from 'src/app/comun/modelos/producto_proveedor.model';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-root-proveedores-insumo-restaurar',
  templateUrl: './root-proveedores-insumo-restaurar.component.html',
  styleUrls: ['./root-proveedores-insumo-restaurar.component.scss']
})
export class RootProveedoresInsumoRestaurarComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listData: MatTableDataSource<ProductoProveedor>;
  displayedColumns: string[] = ['nombre', 'costo', 'detalles', 'proveedor', 'restaurar'];
  busquedaProducto: string = '';
  cargando: boolean = false;
  productos: ProductoProveedor[] = [];
  constructor(
    private proveedoresService: ProveedoresService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerProductosEliminados();
  }

  obtenerProductosEliminados() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo productos eliminados');
    this.proveedoresService.obtenerProductosProveedorEliminados().subscribe(
      (productos: ProductoProveedor[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.productos = productos;
        this.inicializarTabla();
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.error('error', err.error.titulo, err.error.detalles);
      }
    );

  }
  confirmarRestauracion(producto: ProductoProveedor) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Restaurar producto', mensaje: '¿Desea restaurar este producto?', msgBoton: 'Restaurar', color: "accent" }
    })
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) this.restaurarProductoEliminado(producto);
    })
  }
  restaurarProductoEliminado(producto: ProductoProveedor) {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Restaurando producto eliminado');
    this.proveedoresService.restaurarProductoProveedorEliminado(producto).subscribe(
      (resp: Mensaje) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', resp.titulo, resp.detalles);
        this.quitarProductoEliminado(producto);
      }
    );
  }
  quitarProductoEliminado(producto: ProductoProveedor) {
    const indice = this.productos.indexOf(producto);
    this.productos.splice(indice, 1);
    this.listData.data = this.productos;
  }
  borrarBusqueda() {
    this.busquedaProducto = '';
    this.aplicarFiltroBusqueda();
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaProducto.trim().toLowerCase();
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.productos);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (producto: ProductoProveedor, filtro: string) => {
      return producto.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }

}
