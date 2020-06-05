import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoGastoGeneral } from '../modelos/tipo_gasto_general.model';

@Injectable({
  providedIn: 'root'
})
export class TipoGastoGeneralService {

  constructor(private http: HttpClient) { }

  //get
  public obtenerTiposGastoGeneral(): Observable<any> {
    return this.http.get('/api/v1/tipos-gasto-general');
  }
  public obtenerTiposGastoGeneralEliminados(): Observable<any>{
    return this.http.get('/api/v1/tipos-gasto-general/eliminados');
  }
  public obtenerTipoGastoGeneralPorId(id: string): Observable<any> {
    return this.http.get(`/api/v1/tipos-gasto-general/${id}`)
  }
  //post 
  public nuevoTipoGastoGeneral(tipoGastoGeneral: TipoGastoGeneral): Observable<any> {
    return this.http.post('/api/v1/tipos-gasto-general', tipoGastoGeneral);
  }
  //put
  public actualizarTipoGastoGeneral(tipoGastoGeneral: TipoGastoGeneral, id: string): Observable<any> {
    return this.http.put(`/api/v1/tipos-gasto-general/${id}`, tipoGastoGeneral);
  }
  //patch
  public eliminarTipoGastoGeneral(id: string): Observable<any> {
    return this.http.patch(`/api/v1/tipos-gasto-general/${id}/eliminar`, null);
  }
  public restaurarTipoGastoGeneral(id: string): Observable<any> {
    return this.http.patch(`/api/v1/tipos-gasto-general/${id}/restauracion`, null);
  }
}
