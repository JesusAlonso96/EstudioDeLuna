import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../servicios/productos.service';
import { ToastrService } from 'ngx-toastr';
import { Familia } from '../../modelos/familia.model';
import { Producto } from '../../modelos/producto.model';
import { PageEvent, MatDialog } from '@angular/material';
import { ModalDetallesProductoComponent } from 'src/app/empleado/empleado-venta/modal-detalles-producto/modal-detalles-producto.component';
import { AgregarProductoComponent } from './agregar-producto/agregar-producto.component';
import { UsuarioService } from '../../servicios/usuario.service';
import { EliminarProductoComponent } from './eliminar-producto/eliminar-producto.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';

@Component({
  selector: 'app-catalogo-productos',
  templateUrl: './catalogo-productos.component.html',
  styleUrls: ['./catalogo-productos.component.scss']
})
export class CatalogoProductosComponent implements OnInit {
  familias: Familia[];
  page_size: number = 12;
  page_number: number = 1;
  tabLoadTimes: Date[] = [];
  paginadorDesactivado: boolean = false;
  cargando: boolean = false;
  cargandoProducto: boolean = false;
  cargandoEliminado: boolean = false;
  constructor(private productosService: ProductosService, private toastr: ToastrService, private dialog: MatDialog, private usuarioService: UsuarioService) {
    this.familias = [];
  }

  ngOnInit() {
    this.obtenerFamiliasYProductos();
  }
  obtenerFamiliasYProductos() {
    this.cargando = true;
    this.productosService.obtenerProductosPorFamilia().subscribe(
      (familias) => {
        this.cargando = false;
        this.familias = familias;
        console.log(this.familias);
      }
    );
  }
  verDetalles(producto) {
    this.dialog.open(ModalDetallesProductoComponent, {
      data: { producto }
    })
  }
  abrirAgregarProducto(familia, indice) {
    console.log(indice);
    const dialogRef = this.dialog.open(AgregarProductoComponent, {
      data: familia
    })
    dialogRef.afterClosed().subscribe(producto => {
      console.log(producto)
      if (producto != undefined) {
        this.agregarProducto(producto, indice)
      }
    })
  }
  agregarProducto(producto, indice) {
    this.cargandoProducto = true;
    this.usuarioService.agregarNuevoProducto(producto).subscribe(
      (productoGuardado) => {
        this.familias[indice].productos.push(productoGuardado);
        this.toastr.success('Producto agregado correctamente', '', { closeButton: true });
        this.cargandoProducto = false;

      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo);
        this.cargandoProducto = false;
      }
    );
  }
  abrirEliminarProducto(indiceFamilia, indiceProducto) {
    const dialogRef = this.dialog.open(EliminarProductoComponent)
    dialogRef.afterClosed().subscribe(eliminar => {
      if (eliminar) {
        this.eliminarProducto(indiceFamilia, indiceProducto);
      }
    })
  }
  eliminarProducto(indiceFamilia, indiceProducto) {
    this.cargandoEliminado = true;
    this.usuarioService.eliminarProducto(<string>this.familias[indiceFamilia].productos[indiceProducto]._id, <string>this.familias[indiceFamilia]._id).subscribe(
      (eliminado) => {
        console.log(eliminado);
        this.familias[indiceFamilia].productos.splice(indiceProducto, 1);
        this.toastr.success('Producto eliminado correctamente', '', { closeButton: true });
        this.cargandoEliminado = false;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.cargandoEliminado = false;
      }
    );
  }
  abrirEditarProducto(producto, indiceFamilia, indiceProducto) {
    const productoAux = this.asignarValoresAuxiliares(producto);
    console.log(productoAux)
    const dialogRef = this.dialog.open(EditarProductoComponent, {
      data: producto
    })
    dialogRef.afterClosed().subscribe(editar => {
      if (editar) {
        this.editarProducto(producto, productoAux, indiceFamilia, indiceProducto);
      } else {
        this.restablecerValores(indiceFamilia, indiceProducto, productoAux);
      }
    })
  }
  editarProducto(producto: Producto, productoAux: Producto, indiceFamilia, indiceProducto) {
    this.usuarioService.actualizarProducto(producto).subscribe(
      (actualizado) => {
        console.log(actualizado);
        this.toastr.success('Producto actualizado correctamente', '', { closeButton: true });
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.restablecerValores(indiceFamilia, indiceProducto, productoAux);
      }
    );
  }
  asignarValoresAuxiliares(producto) {
    let productoAux: Producto = new Producto();
    productoAux._id = producto._id;
    productoAux.nombre = producto.nombre;
    productoAux.precio = producto.precio;
    productoAux.num_fotos = producto.num_fotos;
    productoAux.familia = producto.familia;
    productoAux.b_n = producto.b_n;
    productoAux.c_r = producto.c_r;
    productoAux.c_ad = producto.c_ad;
    productoAux.descripcion = producto.descripcion;
    return productoAux;
  }
  restablecerValores(indiceFamilia, indiceProducto, productoAuxiliar) {
    this.familias[indiceFamilia].productos[indiceProducto] = productoAuxiliar;
  }
}
