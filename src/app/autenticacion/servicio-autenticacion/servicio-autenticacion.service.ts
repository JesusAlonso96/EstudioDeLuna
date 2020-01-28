import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioLogin } from '../compartido/usuarioLogin.model';
import { Observable } from 'rxjs';
import { JwtHelperService} from '@auth0/angular-jwt';
import { tokenDesencriptado } from '../compartido/tokenDesencriptado.model';
import { map } from 'rxjs/operators';
const jwt = new JwtHelperService();
import * as momento from 'moment';
import 'rxjs/Rx';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacionService {
  private tokenDesencriptado;
  constructor(private http: HttpClient, private rutas: Router) { 
    this.tokenDesencriptado = JSON.parse(localStorage.getItem('usuario_meta')) || new tokenDesencriptado();
  }
  private guardarToken(token: string){
    this.tokenDesencriptado = jwt.decodeToken(token);
    localStorage.setItem('usuario_auth', token);
    localStorage.setItem('usuario_meta', JSON.stringify(this.tokenDesencriptado));
    return token;
  }
  private getExpiracion(){
    return momento.unix(this.tokenDesencriptado.exp);
  }
  public getToken(){
    return localStorage.getItem('usuario_auth');
  }
  public getDatosToken(){
    return localStorage.getItem('usuario_meta');
  }
  public login(datosUsuario: UsuarioLogin): Observable<any>{
    return this.http.post('/api/v1/usuarios/login', datosUsuario).pipe(map((token: string) => this.guardarToken(token)));
  }
  public cerrarSesion(){
    localStorage.removeItem('usuario_auth');
    localStorage.removeItem('usuario_meta');
    this.tokenDesencriptado = new tokenDesencriptado();
  }
  public estaAutenticado():boolean{
    return momento().isBefore(this.getExpiracion());
  }
  public redireccionarUsuario(){
    switch(this.tokenDesencriptado.rol){
      case 0:
        //Usuario normal, trabajador
        if(this.tokenDesencriptado.rol_sec == 1){
          this.rutas.navigate(['/usuario/dashboard'])
        } else {
          this.rutas.navigate(['/usuario/nuevaVenta']);
        }
        break;
      case 1:
        //Supervisor
        this.rutas.navigate(['/supervisor/perfil']);
        break;
      case 2:
        //Administrador
        this.rutas.navigate(['/admin/perfil']);
        break;

    }
  }
  public getIdUsuario(): any{
    return this.tokenDesencriptado.id;
  }
  public getNombreUsuario(): any {
    return this.tokenDesencriptado.nombre;
  }
  public getTipoUsuario(): any{
    return this.tokenDesencriptado.rol;
  }
  public getTipoTrabajador(): any{
    return this.tokenDesencriptado.rol_sec;
  }
}
