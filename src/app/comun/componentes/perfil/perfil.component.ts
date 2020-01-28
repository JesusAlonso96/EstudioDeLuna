import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../modelos/usuario.model';
import { UsuarioService } from '../../servicios/usuario.service';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private usuarioService: UsuarioService, private autService: ServicioAutenticacionService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerUsuario();
  }
  obtenerUsuario() {
    this.cargando = true;
    this.usuarioService.obtenerUsuario(this.autService.getIdUsuario()).subscribe(
      (usuario) => {
        this.cargando = false;
        this.usuario = usuario;
        console.log(this.usuario);
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

}
