import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../servicios/productos.service';
import { Familia } from '../../modelos/familia.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { AgregarFamiliaComponent } from './agregar-familia/agregar-familia.component';
import { UsuarioService } from '../../servicios/usuario.service';
import { EliminarFamiliaComponent } from './eliminar-familia/eliminar-familia.component';

@Component({
  selector: 'app-catalogo-familias',
  templateUrl: './catalogo-familias.component.html',
  styleUrls: ['./catalogo-familias.component.scss']
})
export class CatalogoFamiliasComponent implements OnInit {
  familias: Familia[];
  cargando: boolean = false;
  cargandoAgregar: boolean = false;
  constructor(private productosService: ProductosService, private toastr: ToastrService, public dialog: MatDialog, private usuarioService: UsuarioService) {
    this.familias = [];
  }

  ngOnInit() {
    this.obtenerFamilias();
  }
  obtenerFamilias() {
    this.cargando = true;
    this.productosService.obtenerFamiliasProductos().subscribe(
      (familias) => {
        this.familias = familias;
        console.log(this.familias);
        this.cargando = false;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo)
      }
    );
  }
  abrirAgregarFamilia() {
    const dialogRef = this.dialog.open(AgregarFamiliaComponent);
    dialogRef.afterClosed().subscribe(familia => {
      if (familia != undefined) {
        this.agregarFamilia(familia)
      }
    })
  }
  agregarFamilia(familia: Familia) {
    this.cargandoAgregar = true;
    familia.nombre = familia.nombre.toLowerCase();
    familia.nombre = familia.nombre.replace(/\b[a-z]/g, c => c.toUpperCase());
    this.usuarioService.agregarNuevaFamilia(familia).subscribe(
      (agregada) => {
        this.familias.push(agregada);
        this.toastr.success('Familia de productos agregada correctamente', '', { closeButton: true });
        this.cargandoAgregar = false;
      },
      (err) => {
        if (err.error.tipo == 2) {
          this.toastr.info(err.error.detalles, err.error.titulo, { closeButton: true });
        } else {
          this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        }
        this.cargandoAgregar = false;
      }
    );
  }
  abrirEliminarFamilia(indice) {
    const dialogRef = this.dialog.open(EliminarFamiliaComponent);
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.eliminarFamilia(indice);
      }
    })
  }
  eliminarFamilia(indice) {
    this.usuarioService.eliminarFamilia(<string>this.familias[indice]._id).subscribe(
      () => {
        this.toastr.success('Familia eliminada correctamente', '', { closeButton: true });
        this.familias.splice(indice, 1);
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
}
