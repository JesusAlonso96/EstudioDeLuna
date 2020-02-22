import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { takeUntil } from 'rxjs/operators';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-proveedores-baja',
  templateUrl: './proveedores-baja.component.html',
  styleUrls: ['./proveedores-baja.component.scss']
})
export class ProveedoresBajaComponent implements OnInit, OnDestroy {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnasTabla: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'borrar'];
  proveedores: Proveedor[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedores();
    this.obtenerNuevosProveedores();
    this.obtenerNuevoClienteEditado();
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
  obtenerNuevoClienteEditado() {
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
          this.toastr.info('Se ha editado un nuevo cliente', 'Nuevo cliente', { closeButton: true });
        }
      )
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}

