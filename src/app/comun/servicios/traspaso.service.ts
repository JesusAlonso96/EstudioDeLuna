import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Traspaso } from '../modelos/traspaso.model';

@Injectable({
  providedIn: 'root'
})
export class TraspasoService {

  constructor(private http: HttpClient) { }

  //get
  public obtenerTraspasosPendientes(): Observable<any> {
    return this.http.get('/api/v1/traspasos/pendientes');
  }

  //post 
  public nuevoTraspaso(traspaso: Traspaso): Observable<any> {
    return this.http.post('/api/v1/traspasos', traspaso);
  }

  //put

  //patch
  public eliminarTraspaso(id: string): Observable<any> {
    return this.http.patch(`/api/v1/traspasos/${id}`, null);
  }

  public actualizarEstadoTraspaso(id: string, estado: string): Observable<any> {
    return this.http.patch(`/api/v1/traspasos/${id}/estado`, {estado});
  }
}