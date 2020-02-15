import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { UsuarioLogin } from '../compartido/usuarioLogin.model';
import { ServicioAutenticacionService } from '../servicio-autenticacion/servicio-autenticacion.service';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService } from 'src/app/comun/servicios/websocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  cargando: boolean = false;
  datosUsuario: UsuarioLogin = new UsuarioLogin();

  constructor(public autServicio: ServicioAutenticacionService, private usuarioService: UsuarioService, private toastr: ToastrService, public wsService: WebSocketService) { }

  ngOnInit() { }
  login() {
    this.cargando = true;
    this.autServicio.login(this.datosUsuario).subscribe(
      (usr) => {
        this.usuarioService.crearAsistencia(this.autServicio.getIdUsuario()).subscribe((ok) => { }, (err) => { });
        this.cargando = false;
        this.toastr.success('', 'Bienvenido', { closeButton: true });
        const usuariows = { id: '', _id: this.autServicio.getIdUsuario(), nombre: this.autServicio.getNombreUsuario(), rol: this.autServicio.getTipoUsuario(), rol_sec: this.autServicio.getTipoTrabajador() };
        this.wsService.iniciarSesionWS(usuariows).then(() => {
          this.autServicio.redireccionarUsuario();
        })
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )
  }

}
