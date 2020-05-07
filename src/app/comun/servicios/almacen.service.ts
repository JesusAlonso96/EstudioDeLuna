import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Almacen, InsumoAlmacen, Movimiento } from '../modelos/almacen.model';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(private http: HttpClient) { }

  //get
  public obtenerAlmacenes(): Observable<any> {
    return this.http.get('/api/v1/almacenes');
  }
  public obtenerAlmacenesEliminados(): Observable<any>{
    return this.http.get('/api/v1/almacenes/eliminados');
  }
  public obtenerAlmacenPorId(id: string): Observable<any> {
    return this.http.get(`/api/v1/almacenes/${id}`)
  }
  public obtenerMovimientoAlmacenPorId(id: string, idMovimiento: string): Observable<any> {
    return this.http.get(`/api/v1/almacenes/${id}/movimientos/${idMovimiento}`)
  }
  public obtenerHistorialMovimientos(): Observable<any> {
    return this.http.get('/api/v1/almacenes/historial-movimientos');
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

  public actualizarInsumosAlmacen(id: string, insumos: InsumoAlmacen[]): Observable<any> {
    return this.http.patch(`/api/v1/almacenes/${id}/insumos`, insumos);
  }

  public actualizarInsumoAlmacen(id: string, idInsumo: string, movimiento: Movimiento): Observable<any> {
    return this.http.patch(`/api/v1/almacenes/${id}/insumos/${idInsumo}`, movimiento);
  }
}
