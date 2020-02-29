import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Familia } from '../../modelos/familia.model';
import { ProductosService } from '../../servicios/productos.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { AgregarFamiliaComponent } from './agregar-familia/agregar-familia.component';
import { EliminarFamiliaComponent } from './eliminar-familia/eliminar-familia.component';

@Component({
  selector: 'app-catalogo-familias',
  templateUrl: './catalogo-familias.component.html',
  styleUrls: ['./catalogo-familias.component.scss']
})
export class CatalogoFamiliasComponent implements OnInit, OnDestroy {
  familias: Familia[];
  cargando: boolean = false;
  cargandoAgregar: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private productosService: ProductosService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.obtenerFamilias();
    this.obtenerNuevaFamiliaAgregada();
    this.obtenerNuevaFamiliaEliminada();
  }
  obtenerFamilias() {
    this.cargando = true;
    this.productosService.obtenerFamiliasProductos().subscribe(
      (familias) => {
        this.familias = familias;
        this.cargando = false;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo);
        this.cargando = false;
      }
    );
  }

  obtenerNuevaFamiliaAgregada() {
    this.usuarioService.escucharNuevaFamilia()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (familia: Familia) => {
          this.familias.push(familia);
          this.toastr.info('Se ha agregado una nueva familia', 'Familia agregada', { closeButton: true });
        }
      )
  }
  obtenerNuevaFamiliaEliminada() {
    this.usuarioService.escucharNuevaFamiliaEliminada()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (familia: Familia) => {
          const familiaEliminada = this.familias.find(familiaFil => { return familiaFil._id == familia._id })
          const indice = this.familias.indexOf(familiaEliminada);
          this.familias.splice(indice, 1);
          this.toastr.warning('Nueva familia eliminado', 'Se ha eliminado una familia de productos', { closeButton: true });
        }
      )
  }
  obtenerNuevaFamiliaRestaurada() {

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
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
