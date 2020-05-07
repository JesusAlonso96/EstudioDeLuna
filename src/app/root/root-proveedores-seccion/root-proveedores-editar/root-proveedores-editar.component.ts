import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { Subject } from 'rxjs';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root-proveedores-editar',
  templateUrl: './root-proveedores-editar.component.html',
  styleUrls: ['./root-proveedores-editar.component.scss']
})
export class RootProveedoresEditarComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador: BuscadorComponent;
  @Output() cargandoEvento = new EventEmitter(true);
  columnas: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'editar'];
  proveedores: Proveedor[];
  private onDestroy$ = new Subject<boolean>();
  constructor(
    private proveedoresService: ProveedoresService,
    private toastr: NgToastrService) { }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  ngOnInit(): void {
    this.obtenerProveedores();
    this.obtenerNuevosProveedores();
    this.obtenerNuevoProveedorEditado();
    this.obtenerNuevosProveedoresEliminados();
  }
  obtenerProveedores() {
    this.crearVistaCargando(true, 'Obteniendo proveedores...')
    this.proveedoresService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.crearVistaCargando(false);
        this.proveedores = proveedores;
      },
      (err: any) => {
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
  obtenerNuevoProveedorEditado() {
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
          this.toastr.abrirToastr('info', 'Cliente editado', `Se ha editado al cliente ${proveedor.nombre}`);
        }
      )
  }
  obtenerNuevosProveedoresEliminados() {
    this.proveedoresService.escucharNuevoProveedorEliminado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          const proveedorEliminado = this.proveedores.find(proveedorFil => { return proveedorFil._id == proveedor._id });
          const indice = this.proveedores.indexOf(proveedorEliminado);
          this.proveedores.splice(indice, 1);
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.abrirToastr('advertencia', 'Nuevo cliente eliminado', 'Se ha eliminado un cliente');
        }
      )
  }
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
}
