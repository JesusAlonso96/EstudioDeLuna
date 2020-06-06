import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GastoGeneral } from '../modelos/gasto_general.model';

@Injectable({
  providedIn: 'root'
})
export class GastoGeneralService {

  constructor(private http: HttpClient) { }

  //get
  public obtenerGastosGenerales(): Observable<any> {
    return this.http.get('/api/v1/gastos-generales');
  }
  public obtenerGastosGeneralesEliminados(): Observable<any>{
    return this.http.get('/api/v1/gastos-generales/eliminados');
  }
  public obtenerReporteGastosGeneralesPorFecha(tipo: number, anio: number, mes: number, dia: number): Observable<any>{
    return this.http.get('/api/v1/gastos-generales/reporte-por-fecha?tipo=' + tipo + '&anio=' + anio + '&mes=' + mes + '&dia=' + dia);
  }
  public obtenerReporteGastosGeneralesPorTipoGastoGeneral(tipo: number, anio: number, mes: number, dia: number): Observable<any>{
    return this.http.get('/api/v1/gastos-generales/reporte-por-tipo-gasto-general?tipo=' + tipo + '&anio=' + anio + '&mes=' + mes + '&dia=' + dia);
  }
  public obtenerGastoGeneralPorId(id: string): Observable<any> {
    return this.http.get(`/api/v1/gastos-generales/${id}`)
  }
  //post 
  public nuevoGastoGeneral(gastoGeneral: GastoGeneral): Observable<any> {
    return this.http.post('/api/v1/gastos-generales', gastoGeneral);
  }
  //put
  public actualizarGastoGeneral(gastoGeneral: GastoGeneral, id: string): Observable<any> {
    return this.http.put(`/api/v1/gastos-generales/${id}`, gastoGeneral);
  }
  //patch
  public eliminarGastoGeneral(id: string): Observable<any> {
    return this.http.patch(`/api/v1/gastos-generales/${id}/eliminar`, null);
  }
  public restaurarGastoGeneral(id: string): Observable<any> {
    return this.http.patch(`/api/v1/gastos-generales/${id}/restauracion`, null);
  }
}
