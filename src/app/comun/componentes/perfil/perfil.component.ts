import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../modelos/usuario.model';
import { UsuarioService } from '../../servicios/usuario.service';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { ToastrService } from 'ngx-toastr';
import { NgToastrService } from '../../servicios/ng-toastr.service';
import { CargandoService } from '../../servicios/cargando.service';
export interface contrasenas {
  contrasena: string;
  confirmacion: string;
}
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario;
  cargando: boolean = false;
  contrasenas: contrasenas;
  constructor(private usuarioService: UsuarioService, 
    private autService: ServicioAutenticacionService, 
    private toastr: NgToastrService,
    private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerUsuario();
  }
  obtenerUsuario() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo usuario');
    this.usuarioService.obtenerUsuario(this.autService.getIdUsuario()).subscribe(
      (usuario) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.usuario = usuario;
        console.log(this.usuario);
      },
      (err) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.error('error',err.error.titulo, err.error.titulo);
      }
    );
  }

}
