import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../modelos/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http: HttpClient) { }

  //get
  public obtenerComprasSinRegistrar(): Observable<any> {
    return this.http.get('/api/v1/compras/sin-registrar');
  }

  //post 

  //put

  //patch

}
