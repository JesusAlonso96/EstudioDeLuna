import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';

@Component({
  selector: 'app-proveedores-restaurar',
  templateUrl: './proveedores-restaurar.component.html',
  styleUrls: ['./proveedores-restaurar.component.scss']
})
export class ProveedoresRestaurarComponent implements OnInit, OnDestroy {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'restaurar'];
  proveedores: Proveedor[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private adminService: AdministradorService, private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedoresEliminados();
    this.obtenerNuevosProveedoresEliminados();
    this.obtenerNuevoProveedorRestaurado();
  }

  obtenerProveedoresEliminados() {
    this.cargando = true;
    this.adminService.obtenerProveedoresEliminados().subscribe(
      (proveedoresEliminados: Proveedor[]) => {
        this.cargando = false;
        this.proveedores = proveedoresEliminados;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerNuevosProveedoresEliminados() {
    this.usuarioService.escucharNuevoProveedorEliminado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          this.proveedores.push(proveedor);
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.warning('Se ha eliminado un cliente', 'Nuevo cliente eliminado', { closeButton: true });
        }

      )
  }
  obtenerNuevoProveedorRestaurado() {
    this.usuarioService.escucharNuevoProveedorRestaurado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (proveedor: Proveedor) => {
          const proveedorRestaurado = this.proveedores.find(proveedorFil => { return proveedorFil._id == proveedor._id });
          const indice = this.proveedores.indexOf(proveedorRestaurado);
          this.proveedores.splice(indice, 1);
          this.buscador.datosTabla.data = this.proveedores;
          this.toastr.warning('Se ha restaurado un cliente', 'Cliente restaurado', { closeButton: true });
        }
      )
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}
