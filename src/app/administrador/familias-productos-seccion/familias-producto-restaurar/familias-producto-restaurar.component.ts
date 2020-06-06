import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { ToastrService } from 'ngx-toastr';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-familias-producto-restaurar',
  templateUrl: './familias-producto-restaurar.component.html',
  styleUrls: ['./familias-producto-restaurar.component.scss']
})
export class FamiliasProductoRestaurarComponent implements OnInit, OnDestroy {
  familiasEliminadas: Familia[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private adminService: AdministradorService,
    private toastr: NgToastrService,
    private usuarioService: UsuarioService,
    private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerFamiliasEliminadas();
    this.obtenerNuevaFamiliaEliminada();
    this.obtenerNuevaFamiliaRestaurada();
  }
  obtenerFamiliasEliminadas() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo familias')
    this.adminService.obtenerFamiliasEliminadas().subscribe(
      (familiasEliminadas: Familia[]) => {
        this.familiasEliminadas = familiasEliminadas;
        this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.toastr.error(err.error.detalles, err.error.titulo);
        this.cargandoService.crearVistaCargando(false);
      }
    );
  }
  obtenerNuevaFamiliaEliminada() {
    this.usuarioService.escucharNuevaFamiliaEliminada()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (familia: Familia) => {
          this.familiasEliminadas.push(familia);
          this.toastr.abrirToastr('info', 'Nueva familia eliminado', 'Se ha eliminado una familia de productos');
        }
      )
  }
  obtenerNuevaFamiliaRestaurada() {
    this.usuarioService.escucharNuevaFamiliaRestaurada()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (familia: Familia) => {
          const proveedorRestaurado = this.familiasEliminadas.find(familiaFil => { return familiaFil._id == familia._id });
          const indice = this.familiasEliminadas.indexOf(proveedorRestaurado);
          this.familiasEliminadas.splice(indice, 1);
          this.toastr.abrirToastr('advertencia', 'Se ha restaurado una familia', 'Familia restaurada');
        }
      )
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  abrirRestaurarFamilia(familia: Familia) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando familia');
    this.adminService.restaurarFamilia(familia).subscribe(
      (restaurada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', restaurada.titulo, restaurada.detalles);
        this.familiasEliminadas.splice(this.familiasEliminadas.indexOf(familia), 1);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
}
