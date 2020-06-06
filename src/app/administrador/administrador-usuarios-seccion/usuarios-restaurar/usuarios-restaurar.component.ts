import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { Subject } from 'rxjs';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { takeUntil } from 'rxjs/operators';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-usuarios-restaurar',
  templateUrl: './usuarios-restaurar.component.html',
  styleUrls: ['./usuarios-restaurar.component.scss']
})
export class UsuariosRestaurarComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'restaurar'];
  usuarios: Usuario[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private adminService: AdministradorService, 
    private cargandoService: CargandoService,
    private toastr: NgToastrService, 
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.obtenerUsuariosEliminados();
    this.obtenerNuevosUsuariosEliminados();
    this.obtenerNuevoUsuarioRestaurado();
  }
  obtenerUsuariosEliminados() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo usuarios eliminados');
    this.adminService.obtenerUsuariosEliminados().subscribe(
      (usuariosEliminados: Usuario[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.usuarios = usuariosEliminados;
      },
      (err: any) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.error('error',err.error.titulo, err.error.detalles);
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
          this.toastr.abrirToastr('advertencia','Nuevo cliente eliminado', 'Se ha eliminado un cliente');
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
          this.toastr.abrirToastr('info','Se ha restaurado un usuario', 'Usuario restaurado');
        }
      )
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
