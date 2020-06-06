import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BuscadorComponent } from '../buscador/buscador.component';
import { NgToastrService } from '../../servicios/ng-toastr.service';
import { CargandoService } from '../../servicios/cargando.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(private usuarioService: UsuarioService,
     private toastr: NgToastrService,
     private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerNuevosUsuarios();
    this.obtenerNuevoUsuarioEditado();
    this.obtenerNuevosUsuariosEliminados();
  }
  obtenerUsuarios() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo usuarios');
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.usuarios = usuarios;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.error('error',err.error.titulo, err.error.detalles);
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
          this.toastr.abrirToastr('info','Se ha agregado un nuevo usuario', 'Nuevo usuario');
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
          this.toastr.abrirToastr('info',`Se ha editado al usuario ${usuario.nombre}`, 'Usuario editado');
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
          this.toastr.abrirToastr('advertencia','Se ha eliminado un usuario', 'Nuevo usuario eliminado');
        }
      )
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
