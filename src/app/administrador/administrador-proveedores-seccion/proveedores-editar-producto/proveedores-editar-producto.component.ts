import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, PageEvent } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { ProductoProveedor } from 'src/app/comun/modelos/producto_proveedor.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { EditarProductoProveedorComponent } from 'src/app/comun/componentes/modales/editar-producto-proveedor/editar-producto-proveedor.component';

export interface ListaProveedores {
  _id: string;
  nombre: string;
}

@Component({
  selector: 'app-proveedores-editar-producto',
  templateUrl: './proveedores-editar-producto.component.html',
  styleUrls: ['./proveedores-editar-producto.component.scss']
})
export class ProveedoresEditarProductoComponent implements OnInit {
  cargando: boolean = false;
  listaProveedores: ListaProveedores[] = [];
  productosProveedor: ProductoProveedor[] = [];
  pestanasActivas: boolean[] = [];
  titulo: string = 'Selecciona un proveedor para ver los productos';
  page_size: number = 4;
  page_number: number = 1;
  busquedaProducto: string = '';
  constructor(private usuarioService: UsuarioService, private adminService: AdministradorService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerListaProveedores();
  }
  obtenerListaProveedores() {
    this.cargando = true;
    this.usuarioService.obtenerListaProveedores().subscribe(
      (listaProveedores: ListaProveedores[]) => {
        this.cargando = false;
        this.listaProveedores = listaProveedores;
        if (this.listaProveedores.length > 0) {
          this.activarPestana(0);
        }
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  iniciarPestanas() {
    for (let i = 0; i < this.listaProveedores.length; i++) {
      this.pestanasActivas[i] = false;
    }
  }
  activarPestana(indice: number) {
    this.iniciarPestanas();
    this.pestanasActivas[indice] = true;
    this.obtenerProductosProveedor(indice);
    this.setTitulo('Productos de ' + this.listaProveedores[indice].nombre);
  }
  obtenerProductosProveedor(indice: number) {
    this.cargando = true;
    this.usuarioService.obtenerProductosProveedor(this.listaProveedores[indice]._id).subscribe(
      (productos: ProductoProveedor[]) => {
        this.cargando = false;
        this.productosProveedor = productos;
        console.log(this.productosProveedor);
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  //eliminar producto
  confirmarEliminacion(producto: ProductoProveedor) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Eliminar producto', mensaje: '¿Desea eliminar este producto?', msgBoton: 'Eliminar', color: 'warn' }
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.eliminarProductoProveedor(producto);
      }
    });
  }
  eliminarProductoProveedor(producto: ProductoProveedor) {
    this.cargando = true;
    this.adminService.eliminarProductoProveedor(producto).subscribe(
      (productos: any) => {
        this.cargando = false;
        this.toastr.success('Producto eliminado correctamente', 'Producto eliminado', { closeButton: true });
        this.productosProveedor = productos;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  //editar producto
  abrirEditarProducto(producto: ProductoProveedor) {
    const productoAux: ProductoProveedor = ProductoProveedor.prototype.nuevoProducto(producto._id, producto.id, producto.codigoBarras, producto.nombre, producto.costo, producto.proveedor, producto.detalles, producto.existencias, producto.activo);
    const dialogRef = this.dialog.open(EditarProductoProveedorComponent, {
      data: productoAux
    })
    dialogRef.afterClosed().subscribe(productoModificado => {
      if (productoModificado) {
        this.editarProducto(productoModificado);
      }
    })
  }
  editarProducto(producto: ProductoProveedor) {
    this.cargando = true;
    this.adminService.editarProductoProveedor(producto).subscribe(
      (productos: ProductoProveedor[]) => {
        this.cargando = false;
        this.productosProveedor = productos;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  setTitulo(mensaje: string) {
    this.titulo = mensaje;
  }
  manejarPaginacion(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  borrarBusqueda() {
    this.busquedaProducto = '';
  }
}
