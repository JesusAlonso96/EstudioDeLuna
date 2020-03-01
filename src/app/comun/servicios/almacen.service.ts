import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Almacen } from '../modelos/almacen.model';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(private http: HttpClient) { }

  //get
  public obtenerAlmacenes(): Observable<any> {
    return this.http.get('/api/v1/almacenes');
  }
  public obtenerAlmacenPorId(id: string): Observable<any> {
    return this.http.get(`/api/v1/almacenes/${id}`)
  }
  //post 
  public nuevoAlmacen(almacen: Almacen): Observable<any> {
    return this.http.post('/api/v1/almacenes', almacen);
  }
  //put
  public actualizarAlmacen(almacen: Almacen, id: string): Observable<any> {
    return this.http.put(`/api/v1/almacenes/${id}`, almacen);
  }
  //patch
  public eliminarAlmacen(id: string): Observable<any> {
    return this.http.patch(`/api/v1/almacenes/${id}/eliminar`, null);
  }
  public restaurarAlmacen(id: string): Observable<any> {
    return this.http.patch(`/api/v1/almacenes/${id}/restauracion`, null);
  }
}
