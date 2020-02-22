import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { Subject } from 'rxjs';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-restaurar',
  templateUrl: './usuarios-restaurar.component.html',
  styleUrls: ['./usuarios-restaurar.component.scss']
})
export class UsuariosRestaurarComponent implements OnInit, OnDestroy {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'restaurar'];
  usuarios: Usuario[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private adminService: AdministradorService, private toastr: ToastrService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.obtenerUsuariosEliminados();
    this.obtenerNuevosUsuariosEliminados();
    this.obtenerNuevoUsuarioRestaurado();
  }
  obtenerUsuariosEliminados() {
    this.cargando = true;
    this.adminService.obtenerUsuariosEliminados().subscribe(
      (usuariosEliminados: Usuario[]) => {
        this.cargando = false;
        this.usuarios = usuariosEliminados;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerNuevosUsuariosEliminados() {
    this.usuarioService.escucharNuevoUsuarioEliminado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (usuario: Usuario) => {
          this.usuarios.push(usuario);
          this.buscador.datosTabla.data = this.usuarios;
          this.toastr.warning('Nuevo cliente eliminado', 'Se ha eliminado un cliente', { closeButton: true });
        }
      )
  }
  obtenerNuevoUsuarioRestaurado() {
    this.usuarioService.escucharNuevoUsuarioRestaurado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (usuario: Usuario) => {
          const usuarioRestaurado = this.usuarios.find(usuarioFil => { usuarioFil._id == usuario._id });
          const indice = this.usuarios.indexOf(usuarioRestaurado);
          this.usuarios.splice(indice, 1);
          this.buscador.datosTabla.data = this.usuarios;
          this.toastr.warning('Se ha restaurado un usuario', 'Usuario restaurado', { closeButton: true });
        }
      )
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
