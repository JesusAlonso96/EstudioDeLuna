import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Caja } from '../modelos/caja.model';
import { CorteCaja } from '../modelos/corte_caja.model';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(private http: HttpClient) { }

  public obtenerCajas(): Observable<any> {
    return this.http.get('/api/v2/cajas');
  }
  public obtenerCaja(id: string): Observable<any> {
    return this.http.get(`/api/v2/cajas/${id}`);
  }
  public obtenerCajasEliminadas(): Observable<any> {
    return this.http.get('/api/v2/cajas/eliminadas');
  }
  public obtenerCortesCaja(idCaja: string): Observable<any> {
    return this.http.get(`/api/v2/cajas/cortes-caja/${idCaja}`);
  }
  public agregarCaja(caja: Caja): Observable<any> {
    return this.http.post('/api/v2/cajas', caja);
  }
  public crearCorteCaja(corteCaja: CorteCaja): Observable<any> {
    return this.http.post('/api/v2/cajas/corte-caja', corteCaja);
  }
  public eliminarCaja(caja: Caja): Observable<any> {
    return this.http.patch('/api/v2/cajas', caja);
  }
  public restaurarCaja(caja: Caja): Observable<any> {
    return this.http.patch('/api/v2/cajas/restaurar', caja);
  }
  public actualizarCaja(caja: Caja): Observable<any> {
    return this.http.patch(`/api/v2/cajas/${caja._id}`, caja);
  }
  public existeCorteCaja(idCaja: string): Observable<any> {
    return this.http.get(`/api/v2/cajas/existe-corte/${idCaja}`)
  }
}
