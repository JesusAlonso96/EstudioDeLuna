import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from './websocket.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient,
    private wsService: WebSocketService) { }


  public obtenerDatosGeneralesEmpresa(): Observable<any> {
    return this.http.get('/api/v2/empresa/datos-generales');
  }
  public obtenerLogotipoEmpresa(): Observable<any> {
    return this.http.get('/api/v2/empresa/logotipo');
  }
  public cambiarLogotipo(imagenLogo: any): Observable<any> {
    const imagen = new FormData();
    imagen.append('imagen', imagenLogo);
    return this.http.patch('/api/v2/empresa/logotipo', imagen);
  }
  public escucharNuevoLogo() {
    return this.wsService.escuchar('nuevo-logotipo');
  }
}
