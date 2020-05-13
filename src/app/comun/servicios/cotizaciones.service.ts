import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cotizacion } from '../modelos/cotizacion.model';
import { EmpresaCot } from '../modelos/empresa_cot.model';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  constructor(private http: HttpClient) { }
  public obtenerCotizacionesRealizadas(): Observable<any> {
    return this.http.get('/api/v2/cotizaciones');
  }
  public obtenerEmpresas(): Observable<any> {
    return this.http.get('/api/v2/cotizaciones/empresas');
  }
  public agregarCotizacion(cotizacion: Cotizacion): Observable<any> {
    return this.http.post('/api/v2/cotizaciones', cotizacion);
  }
  public actualizarEmpresa(empresa: EmpresaCot): Observable<any> {
    return this.http.put('/api/v2/cotizaciones/empresa', empresa);
  }
  public eliminarEmpresa(empresa: EmpresaCot): Observable<any> {
    return this.http.patch('/api/v2/cotizaciones/empresa', empresa);
  }
  public agregarEmpresa(empresa: EmpresaCot): Observable<any> {
    return this.http.post('/api/v2/cotizaciones/empresas', empresa);
  }
  
}
