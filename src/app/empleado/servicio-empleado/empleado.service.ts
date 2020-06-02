import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/comun/modelos/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private http: HttpClient) { }

  //get
  public asignarFotografoLibre(fecha): Observable<any> {
    return this.http.get(`/api/v1/empleados/asignarFotografo/${fecha}`);
  }
 

 
 

  public obtenerFotografos(): Observable<any> {
    return this.http.get('/api/v1/empleados/fotografos');
  }
  public obtenerFotografo(id): Observable<any> {
    return this.http.get(`/api/v1/empleados/fotografo/${id}`)
  }
  public obtenerNotificaciones(id, fecha): Observable<any> {
    return this.http.get(`/api/v1/empleados/obtenerNotificaciones/${id}/${fecha}`)
  }
  


  //post
 
  public crearVenta(pedido: Pedido, cantidadACaja, metodoPago, idCaja: string): Observable<any> {
    return this.http.post(`/api/v1/empleados/crearVenta/${cantidadACaja}/${metodoPago}/${idCaja}`, pedido);
  }
  //patch
  public crearFoto(imagen: FormData, idPedido: string): Observable<any> {
    return this.http.patch(`/api/v1/empleados/crearImagen/${idPedido}`, imagen)
  }

  
 
  public actualizarEstadoFotografo(id): Observable<any> {
    return this.http.patch(`/api/v1/empleados/actualizarOcupado/${id}`, null)
  }
  //borrar
  public actualizarCaja(cantidadACaja, metodoPago): Observable<any> {
    return this.http.patch(`/api/v1/empleados/actualizarCaja/${cantidadACaja}/${metodoPago}`, null)
  }
  //delete
  public eliminarNotificacion(id): Observable<any> {
    return this.http.delete(`/api/v1/empleados/eliminarNotificacion/${id}`);
  }
  
}
