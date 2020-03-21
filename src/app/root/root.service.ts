import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal } from '../comun/modelos/sucursal.model';
import { Usuario } from '../comun/modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class RootService {

  constructor(private http: HttpClient) { }
  //get
  public obtenerUsuariosSinSucursal(): Observable<any> {
    return this.http.get('/api/v2/root/usuarios-sucursal');
  }
  public obtenerSucursales(): Observable<any> {
    return this.http.get('/api/v2/root/sucursales');
  }
  //post
  public agregarSucursal(sucursal: Sucursal): Observable<any> {
    return this.http.post('/api/v2/root/sucursal', sucursal);
  }
  //patch
  public asignarSucursal(sucursal: Sucursal, usuario: Usuario): Observable<any> {
    return this.http.patch('/api/v2/root/usuarios', { sucursal, usuario });
  }
} 
