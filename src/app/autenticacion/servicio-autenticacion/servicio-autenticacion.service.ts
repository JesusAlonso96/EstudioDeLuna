import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioLogin } from '../compartido/usuarioLogin.model';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tokenDesencriptado } from '../compartido/tokenDesencriptado.model';
import { map, delay } from 'rxjs/operators';
const jwt = new JwtHelperService();
import * as momento from 'moment';
import 'rxjs/Rx';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/comun/servicios/websocket.service';
import { environment } from '../../../environments/environment'
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacionService {
  private tokenDesencriptado;
  private urlFotos = environment.url_fotos;
  temas: string[] = ['default', 'tema-rojo', 'tema-azul', 'tema-verde'];

  constructor(private http: HttpClient, private rutas: Router, 
    private wsService: WebSocketService,
    private overlayContainer: OverlayContainer) {
    this.tokenDesencriptado = JSON.parse(localStorage.getItem('usuario_meta')) || new tokenDesencriptado();
  }
  private guardarToken(token: string) {
    this.tokenDesencriptado = jwt.decodeToken(token);
    localStorage.setItem('usuario_auth', token);
    localStorage.setItem('usuario_meta', JSON.stringify(this.tokenDesencriptado));
    return token;
  }
  private getExpiracion() {
    return momento.unix(this.tokenDesencriptado.exp);
  }
  public getToken() {
    return localStorage.getItem('usuario_auth');
  }
  public getDatosToken() {
    return localStorage.getItem('usuario_meta');
  }
  public getTokenDesencriptado() {
    return this.tokenDesencriptado;
  }
  public login(datosUsuario: UsuarioLogin): Observable<any> {
    return this.http.post('/api/v1/usuarios/login', datosUsuario)
    .pipe(delay(0))
    .pipe(map((token: string) => this.guardarToken(token)));
  }
  public cerrarSesion() {
    this.overlayContainer.getContainerElement().classList.remove(...this.temas)
    this.wsService.cerrarSesionWS().then(() => {
      localStorage.removeItem('usuario_auth');
      localStorage.removeItem('usuario_meta');
      localStorage.removeItem('moduloActual');
      localStorage.removeItem('tema-actual');
    })
    this.tokenDesencriptado = new tokenDesencriptado();
  }
  public estaAutenticado(): boolean {
    return momento().isBefore(this.getExpiracion());
  }
  public redireccionarUsuario() {
    switch (this.tokenDesencriptado.rol) {
      case 0:
        //Usuario normal, trabajador
        if (this.tokenDesencriptado.rol_sec == 1) {
          this.rutas.navigate(['/usuario/dashboard']);
          localStorage.setItem('moduloActual', 'Tablero principal');
        } else {
          this.rutas.navigate(['/usuario/nuevaVenta']);
          localStorage.setItem('moduloActual', 'Punto de venta');
        }
        break;
      case 1:
        //Supervisor
        this.rutas.navigate(['/supervisor/perfil']);
        localStorage.setItem('moduloActual', 'Perfil personal');
        break;
      case 2:
        //Administrador
        this.rutas.navigate(['/admin/dashboard']);
        localStorage.setItem('moduloActual', 'Tablero principal');
        break;
      case 3:
        this.rutas.navigate(['/root/dashboard']);
        localStorage.setItem('moduloActual', 'Tablero principal');
        break;
    }
  }
  public getConfiguracionNotificaciones(): any {
    return this.tokenDesencriptado.configuracion.notificaciones;
  }
  public getConfiguracionTema(): any {
    console.log("temaa",this.tokenDesencriptado.configuracion.tema)
    return this.tokenDesencriptado.configuracion.tema;
  }
  public getIdUsuario(): string {
    return this.tokenDesencriptado.id;
  }
  public getNombreUsuario(): any {
    return this.tokenDesencriptado.nombre;
  }
  public getApePatUsuario(): string {
    return  this.tokenDesencriptado.ape_pat;
  }
  public getApeMatUsuario(): string {
    return  this.tokenDesencriptado.ape_mat ? this.tokenDesencriptado.ape_mat : '';
  }
  public getCorreoUsuario(): string {
    return this.tokenDesencriptado.correo;
  }
  public getIdSucursal(): any {
    return this.tokenDesencriptado.sucursal;
  }
  public getTipoUsuario(): any {
    return this.tokenDesencriptado.rol;
  }
  public getTipoTrabajador(): any {
    return this.tokenDesencriptado.rol_sec;
  }
  public getRutaLogo(): any {
    return this.urlFotos + this.tokenDesencriptado.logo;
  }
}
