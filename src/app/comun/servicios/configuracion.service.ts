import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificaciones } from '../modelos/usuario.model';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private http: HttpClient,
    private wsService: WebSocketService) { }

  public obtenerConfiguracion(): Observable<any> {
    return this.http.get('/api/v2/configuracion');
  }
  public guardarConfiguracionNotificaciones(configuracionNotificaciones: Notificaciones): Observable<any> {
    return this.http.patch('/api/v2/configuracion/notificaciones', configuracionNotificaciones);
  }
  public cambiarLogotipo(imagenLogo: any): Observable<any> {
    const imagen = new FormData();
    imagen.append('imagen', imagenLogo);
    return this.http.patch('/api/v2/configuracion/logotipo', imagen);
  }
  public escucharNuevoLogo(){
    return this.wsService.escuchar('nuevo-logotipo');
  }

}
