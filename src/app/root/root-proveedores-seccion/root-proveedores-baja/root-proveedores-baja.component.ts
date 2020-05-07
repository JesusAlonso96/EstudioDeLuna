import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root-proveedores-baja',
  templateUrl: './root-proveedores-baja.component.html',
  styleUrls: ['./root-proveedores-baja.component.scss']
})
export class RootProveedoresBajaComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador: BuscadorComponent;
  @Output() cargandoEvento = new EventEmitter(true);
  columnasTabla: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'borrar'];
  proveedores: Proveedor[];
  private onDestroy$ = new Subject<boolean>();
  constructor(
    private proveedoresService: ProveedoresService,
    private toastr: NgToastrService) { }

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
    this.crearVistaCargando(true, 'Obteniendo proveedores...')
    this.proveedoresService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.crearVistaCargando(false);
        this.proveedores = proveedores;
      },
      (err: HttpErrorResponse) => {
        this.crearVistaCargando(false);
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
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
}
