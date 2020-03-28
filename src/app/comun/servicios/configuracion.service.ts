import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificaciones } from '../modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private http: HttpClient) { }

  public obtenerConfiguracion(): Observable<any>{
    return this.http.get('/api/v2/configuracion');
  }
  public guardarConfiguracionNotificaciones(configuracionNotificaciones: Notificaciones): Observable<any> {
    return this.http.patch('/api/v2/configuracion/notificaciones', configuracionNotificaciones );
  }
}
