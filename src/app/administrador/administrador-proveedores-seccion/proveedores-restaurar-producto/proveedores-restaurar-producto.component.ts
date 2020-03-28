import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ProductoProveedor } from 'src/app/comun/modelos/producto_proveedor.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';

@Component({
  selector: 'app-proveedores-restaurar-producto',
  templateUrl: './proveedores-restaurar-producto.component.html',
  styleUrls: ['./proveedores-restaurar-producto.component.scss']
})
export class ProveedoresRestaurarProductoComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listData: MatTableDataSource<ProductoProveedor>;
  displayedColumns: string[] = ['nombre', 'costo', 'detalles', 'proveedor', 'restaurar'];
  busquedaProducto: string = '';
  cargando: boolean = false;
  productos: ProductoProveedor[] = [];
  constructor(private adminService: AdministradorService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerProductosEliminados();
  }

  obtenerProductosEliminados() {
    this.cargando = true;
    this.adminService.obtenerProductosProveedorEliminados().subscribe(
      (productos: ProductoProveedor[]) => {
        this.cargando = false;
        this.productos = productos;
        this.inicializarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
    this.cargando = true;
    this.adminService.restaurarProductoProveedorEliminado(producto).subscribe(
      (restaurado: Mensaje) => {
        this.cargando = false;
        this.toastr.success(restaurado.detalles, restaurado.titulo, { closeButton: true });
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
