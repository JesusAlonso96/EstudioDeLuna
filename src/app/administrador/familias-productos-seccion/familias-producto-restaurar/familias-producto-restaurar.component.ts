import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { ToastrService } from 'ngx-toastr';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';

@Component({
  selector: 'app-familias-producto-restaurar',
  templateUrl: './familias-producto-restaurar.component.html',
  styleUrls: ['./familias-producto-restaurar.component.scss']
})
export class FamiliasProductoRestaurarComponent implements OnInit, OnDestroy {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnasTabla: string[] = ['id', 'nombre', 'restaurar'];
  familiasEliminadas: Familia[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private adminService: AdministradorService,
    private toastr: ToastrService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.obtenerFamiliasEliminadas();
    this.obtenerNuevaFamiliaEliminada();
    this.obtenerNuevaFamiliaRestaurada();
  }
  obtenerFamiliasEliminadas() {
    this.cargando = true;
    this.adminService.obtenerFamiliasEliminadas().subscribe(
      (familiasEliminadas: Familia[]) => {
        this.familiasEliminadas = familiasEliminadas;
        this.cargando = false;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo);
        this.cargando = false;
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
          this.buscador.datosTabla.data = this.familiasEliminadas;
          this.toastr.warning('Nueva familia eliminado', 'Se ha eliminado una familia de productos', { closeButton: true });
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
          this.buscador.datosTabla.data = this.familiasEliminadas;
          this.toastr.warning('Se ha restaurado una familia', 'Familia restaurada', { closeButton: true });
        }
      )
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
