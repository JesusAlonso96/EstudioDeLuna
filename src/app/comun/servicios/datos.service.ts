import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private http: HttpClient) { }
  //get
  public obtenerDatosEstudio(): Observable<any> {
    return this.http.get('/api/v1/datos');
  }
}
