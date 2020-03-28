import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { UsuarioLogin } from '../compartido/usuarioLogin.model';
import { ServicioAutenticacionService } from '../servicio-autenticacion/servicio-autenticacion.service';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService } from 'src/app/comun/servicios/websocket.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { RecuperarContrasenaComponent } from '../recuperar-contrasena/recuperar-contrasena.component';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  cargando: boolean = false;
  datosUsuario: UsuarioLogin = new UsuarioLogin();
  constructor(public autServicio: ServicioAutenticacionService, private usuarioService: UsuarioService,
    private _toastr: NgToastrService,
    private toastr: ToastrService,
    public wsService: WebSocketService,
    private dialog: MatDialog) { }

  ngOnInit() {
    if(this.autServicio.estaAutenticado()){
      console.log('holaaaaa')
      this.autServicio.redireccionarUsuario();
    } else {
      console.log('...')
    }
   }
  login() {
    this.cargando = true;
    this.autServicio.login(this.datosUsuario).subscribe(
      (usr) => {
        this.usuarioService.crearAsistencia(this.autServicio.getIdUsuario()).subscribe((ok) => { }, (err) => { });
        this.cargando = false;
        localStorage.removeItem('c-rec');
        this._toastr.abrirToastr('exito','','Bienvenido');
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
  abrirRecuperarContrasena() {
    this.dialog.open(RecuperarContrasenaComponent,{
      width: '50%'
    })
  }
}
