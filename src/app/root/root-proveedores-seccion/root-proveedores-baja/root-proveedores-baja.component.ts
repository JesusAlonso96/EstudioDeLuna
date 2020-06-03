import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';

@Component({
  selector: 'app-root-proveedores-baja',
  templateUrl: './root-proveedores-baja.component.html',
  styleUrls: ['./root-proveedores-baja.component.scss']
})
export class RootProveedoresBajaComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnasTabla: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'borrar'];
  proveedores: Proveedor[];
  private onDestroy$ = new Subject<boolean>();
  constructor(
    private proveedoresService: ProveedoresService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService) { }

  ngOnInit(): void {
    this.obtenerProveedores();
    this.obtenerNuevosProveedores();
    this.obtenerNuevoClienteEditado();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  obtenerProveedores() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo proveedores...')
    this.proveedoresService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.proveedores = proveedores;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  obtenerNuevosProveedores() {
    this.proveedoresService.escucharNuevoProveedor()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          this.proveedores.push(proveedor);
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.abrirToastr('info', 'Nuevo proveedor', 'Se ha agregado un nuevo proveedor');
        }
      )
  }
  obtenerNuevoClienteEditado() {
    this.proveedoresService.escucharNuevoProveedorEditado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          const proveedorEncontrado = this.proveedores.find(proveedorFil => { return proveedorFil._id == proveedor._id });
          const indice = this.proveedores.indexOf(proveedorEncontrado);
          this.proveedores[indice] = proveedor;
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.abrirToastr('info', 'Nuevo cliente', 'Se ha editado un nuevo cliente');
        }
      )
  }
}
