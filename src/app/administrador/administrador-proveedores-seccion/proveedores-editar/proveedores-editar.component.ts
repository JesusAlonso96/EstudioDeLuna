import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { Subject } from 'rxjs';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-proveedores-editar',
  templateUrl: './proveedores-editar.component.html',
  styleUrls: ['./proveedores-editar.component.scss']
})
export class ProveedoresEditarComponent implements OnInit, OnDestroy {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'editar'];
  proveedores: Proveedor[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedores();
    this.obtenerNuevosProveedores();
    this.obtenerNuevoProveedorEditado();
    this.obtenerNuevosProveedoresEliminados();
  }
  obtenerProveedores() {
    this.cargando = true;
    this.usuarioService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.cargando = false;
        this.proveedores = proveedores;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerNuevosProveedores() {
    this.usuarioService.escucharNuevoProveedor()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          this.proveedores.push(proveedor);
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.info('Se ha agregado un nuevo proveedor', 'Nuevo proveedor', { closeButton: true });
        }
      )
  }
  obtenerNuevoProveedorEditado() {
    this.usuarioService.escucharNuevoProveedorEditado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          const proveedorEncontrado = this.proveedores.find(proveedorFil => { return proveedorFil._id == proveedor._id });
          const indice = this.proveedores.indexOf(proveedorEncontrado);
          this.proveedores[indice] = proveedor;
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.info(`Se ha editado al cliente ${proveedor.nombre}`, 'Cliente editado', { closeButton: true });
        }
      )
  }
  obtenerNuevosProveedoresEliminados() {
    this.usuarioService.escucharNuevoProveedorEliminado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          const proveedorEliminado = this.proveedores.find(proveedorFil => { return proveedorFil._id == proveedor._id });
          const indice = this.proveedores.indexOf(proveedorEliminado);
          this.proveedores.splice(indice, 1);
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.warning('Se ha eliminado un cliente', 'Nuevo cliente eliminado', { closeButton: true });
        }
      )
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
