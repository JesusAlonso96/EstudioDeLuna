import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { Notificacion } from 'src/app/comun/modelos/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private http: HttpClient) { }
  
  //get
  public asignarFotografoLibre(fecha): Observable<any> {
    return this.http.get(`/api/v1/empleados/asignarFotografo/${fecha}`);
  }
  public numPedidosFotografo(): Observable<any> {
    return this.http.get('/api/v1/empleados/numPedidos');
  }
  public obtenerPedidosRealizados(id): Observable<any> {
    return this.http.get(`/api/v1/empleados/obtenerPedidosPorEmpleado/${id}`)
  }
  public obtenerNumPedidosRealizados(): Observable<any> {
    return this.http.get('/api/v1/empleados/obtenerNumPedidosPorEmpleado')
  }
  public obtenerPedidosEnProceso(id): Observable<any> {
    return this.http.get(`/api/v1/empleados/obtenerPedidosEnProceso/${id}`)
  }
  public obtenerNumPedidosEnProceso(): Observable<any> {
    return this.http.get('/api/v1/empleados/obtenerNumPedidosEnProceso')
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
  public obtenerPedidos(): Observable<any> {
    return this.http.get('/api/v1/empleados/obtenerPedidos')
  }
  public obtenerPedidosEnCola(): Observable<any> {
    return this.http.get('/api/v1/empleados/obtenerPedidosEnCola');
  }
  public obtenerNumPedidosEnCola(): Observable<any> {
    return this.http.get('/api/v1/empleados/obtenerNumPedidosEnCola');
  }
  public obtenerProductosPorPedido(id): Observable<any> {
    return this.http.get(`/api/v1/empleados/obtenerProductosPorPedido/${id}`);
  }

  //post
  public crearPedido(pedido: Pedido, id?: String): Observable<any> {
    return this.http.post(`/api/v1/empleados/crearPedido/${id}`, pedido);
  }
  public crearVenta(pedido: Pedido, cantidadACaja, metodoPago): Observable<any> {
    return this.http.post(`/api/v1/empleados/crearVenta/${cantidadACaja}/${metodoPago}`, pedido);
  }
  //patch
  public crearFoto(image, id): Observable<any> {
    return this.http.patch(`/api/v1/empleados/crearImagen/${id}`, image)
  }
  public tomarPedido(idPedido: string, id: string): Observable<any> {
    return this.http.patch(`/api/v1/empleados/tomarPedido/${idPedido}/${id}`, null);
  }
  public actualizarEstado(pedido): Observable<any> {
    return this.http.patch('/api/v1/empleados/actualizarEstado', pedido);
  }
  public actualizarAnticipo(id, anticipo): Observable<any> {
    return this.http.patch(`/api/v1/empleados/actualizarAnticipo/${id}/${anticipo}`, null);
  }
  public actualizarEstadoFotografo(id): Observable<any> {
    return this.http.patch(`/api/v1/empleados/actualizarOcupado/${id}`, null)
  }
  public actualizarCaja(cantidadACaja, metodoPago): Observable<any> {
    return this.http.patch(`/api/v1/empleados/actualizarCaja/${cantidadACaja}/${metodoPago}`, null)
  }
  //delete
  public eliminarNotificacion(id): Observable<any> {
    return this.http.delete(`/api/v1/empleados/eliminarNotificacion/${id}`);
  }
  public eliminarNotificacionPorPedido(num): Observable<any> {
    return this.http.delete(`/api/v1/empleados/eliminarNotificacionPorPedido/${num}`);
  }
}
