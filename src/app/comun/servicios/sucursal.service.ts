import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  constructor(private http: HttpClient) { }

  //get
  public obtenerSucursales(): Observable<any> {
    return this.http.get('/api/v1/sucursales');
  }
  public obtenerAlmacenesSucursal(id: string): Observable<any>{
    return this.http.get(`/api/v1/sucursales/${id}/almacenes`)
  }
}