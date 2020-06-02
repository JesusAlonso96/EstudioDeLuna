import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { Subject } from 'rxjs';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-root-proveedores-restaurar',
  templateUrl: './root-proveedores-restaurar.component.html',
  styleUrls: ['./root-proveedores-restaurar.component.scss']
})
export class RootProveedoresRestaurarComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'restaurar'];
  proveedores: Proveedor[];
  private onDestroy$ = new Subject<boolean>();
  constructor(
    private proveedoresService: ProveedoresService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService) { }

  ngOnInit(): void {
    this.obtenerProveedoresEliminados();
    this.obtenerNuevosProveedoresEliminados();
    this.obtenerNuevoProveedorRestaurado();
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  obtenerProveedoresEliminados() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo proveedores eliminados...')
    this.proveedoresService.obtenerProveedoresEliminados().subscribe(
      (proveedoresEliminados: Proveedor[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.proveedores = proveedoresEliminados;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  obtenerNuevosProveedoresEliminados() {
    this.proveedoresService.escucharNuevoProveedorEliminado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          this.proveedores.push(proveedor);
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.abrirToastr('advertencia', 'Nuevo cliente eliminado', 'Se ha eliminado un cliente');
        }

      )
  }
  obtenerNuevoProveedorRestaurado() {
    this.proveedoresService.escucharNuevoProveedorRestaurado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          const proveedorRestaurado = this.proveedores.find(proveedorFil => { return proveedorFil._id == proveedor._id });
          const indice = this.proveedores.indexOf(proveedorRestaurado);
          this.proveedores.splice(indice, 1);
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.abrirToastr('advertencia', 'Cliente restaurado', 'Se ha restaurado un cliente');
        }
      )
  }

}
