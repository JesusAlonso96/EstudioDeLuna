import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuarios-baja',
  templateUrl: './usuarios-baja.component.html',
  styleUrls: ['./usuarios-baja.component.scss']
})
export class UsuariosBajaComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'borrar'];
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
  }

  obtenerUsuarios() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo usuarios');
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.usuarios = usuarios;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
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
      );
  }
  obtenerNuevoUsuarioEditado() {
    this.usuarioService.escucharNuevoUsuarioEditado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (usuario: Usuario) => {
          const clienteEncontrado = this.usuarios.find(usuarioFil => { return usuarioFil._id == usuario._id })
          const indice = this.usuarios.indexOf(clienteEncontrado);
          this.usuarios[indice] = usuario;
          this.buscador.datosTabla.data = this.usuarios;
          this.toastr.abrirToastr('info','Se ha editado un usuario', 'Nuevo usuario');
        }
      );
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
