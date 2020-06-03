import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GastoInsumo } from '../modelos/gasto_insumo.model';

@Injectable({
  providedIn: 'root'
})
export class GastoInsumoService {

  constructor(private http: HttpClient) { }

  //get
  public obtenerGastosInsumos(): Observable<any> {
    return this.http.get('/api/v1/gastos-insumos');
  }
  public obtenerGastosInsumosEliminados(): Observable<any>{
    return this.http.get('/api/v1/gastos-insumos/eliminados');
  }
  public obtenerGastoInsumoPorId(id: string): Observable<any> {
    return this.http.get(`/api/v1/gastos-insumos/${id}`)
  }
  //post 
  public nuevoGastoInsumo(gastoInsumo: GastoInsumo): Observable<any> {
    return this.http.post('/api/v1/gastos-insumos', gastoInsumo);
  }
  //put
  public actualizarGastoInsumo(gastoInsumo: GastoInsumo, id: string): Observable<any> {
    return this.http.put(`/api/v1/gastos-insumos/${id}`, gastoInsumo);
  }
  //patch
  public eliminarGastoInsumo(id: string): Observable<any> {
    return this.http.patch(`/api/v1/gastos-insumos/${id}/eliminar`, null);
  }
  public restaurarGastoInsumo(id: string): Observable<any> {
    return this.http.patch(`/api/v1/gastos-insumos/${id}/restauracion`, null);
  }
}
