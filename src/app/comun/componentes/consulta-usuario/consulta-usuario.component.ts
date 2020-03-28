import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BuscadorComponent } from '../buscador/buscador.component';

@Component({
  selector: 'app-consulta-usuario',
  templateUrl: './consulta-usuario.component.html',
  styleUrls: ['./consulta-usuario.component.scss']
})
export class ConsultaUsuarioComponent implements OnInit, OnDestroy {

  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'editar', 'permisos'];
  usuarios: Usuario[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerNuevosUsuarios();
    this.obtenerNuevoUsuarioEditado();
    this.obtenerNuevosUsuariosEliminados();
  }
  obtenerUsuarios() {
    this.cargando = true;
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios) => {
        this.cargando = false;
        this.usuarios = usuarios;
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerNuevosUsuarios() {
    this.usuarioService.escucharNuevoUsuario()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (usuario: Usuario) => {
          this.usuarios.push(usuario);
          this.buscador.datosTabla.data = this.usuarios;
          this.toastr.info('Se ha agregado un nuevo usuario', 'Nuevo usuario', { closeButton: true });
        }
      )
  }
  obtenerNuevoUsuarioEditado() {
    this.usuarioService.escucharNuevoUsuarioEditado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (usuario: Usuario) => {
          const usuarioEditado = this.usuarios.find(usuarioFil => { return usuarioFil._id == usuario._id });
          const indice = this.usuarios.indexOf(usuarioEditado);
          this.usuarios[indice] = usuario;
          this.buscador.datosTabla.data = this.usuarios;
          this.toastr.info(`Se ha editado al usuario ${usuario.nombre}`, 'Usuario editado', { closeButton: true });
        }
      )
  }
  obtenerNuevosUsuariosEliminados() {
    this.usuarioService.escucharNuevoUsuarioEliminado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (usuario: Usuario) => {
          const usuarioEliminado = this.usuarios.find(usuarioFil => { return usuarioFil._id == usuario._id });
          const indice = this.usuarios.indexOf(usuarioEliminado);
          this.usuarios.splice(indice, 1);
          this.buscador.datosTabla.data = this.usuarios;
          this.toastr.warning('Se ha eliminado un usuario', 'Nuevo usuario eliminado', { closeButton: true });
        }
      )
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
