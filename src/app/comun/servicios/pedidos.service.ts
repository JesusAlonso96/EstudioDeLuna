import { Injectable, Output, EventEmitter } from '@angular/core';
import { Pedido } from '../modelos/pedido.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebSocketService } from './websocket.service';
import { NgToastrService } from './ng-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  constructor(public wsService: WebSocketService, private http: HttpClient, private toastr: NgToastrService) { }

  public numPedidosFotografo(): Observable<any> {
    return this.http.get('/api/v2/pedidos/numero-pedidos');
  }
  public obtenerPedidos(tipofiltro: number): Observable<any> {
    return this.http.get(`/api/v2/pedidos/${tipofiltro}`)
  }
  public obtenerPedidosRealizados(idEmpleado: string, tipoFiltro: number): Observable<any> {
    return this.http.get(`/api/v2/pedidos/pedidos/${idEmpleado}?tipoFiltro=${tipoFiltro}`)
  }
  public obtenerNumPedidosRealizados(): Observable<any> {
    return this.http.get('/api/v2/pedidos/empleados')
  }
  public obtenerPedidosEnProceso(id): Observable<any> {
    return this.http.get(`/api/v2/pedidos/proceso/${id}`)
  }
  public obtenerNumPedidosEnProceso(): Observable<any> {
    return this.http.get('/api/v2/pedidos/numero-pedidos-proceso')
  }
  public obtenerPedidosEnCola(): Observable<any> {
    return this.http.get('/api/v2/pedidos/cola');
  }
  public obtenerNumPedidosEnColaEmpleado(): Observable<any> {
    return this.http.get('/api/v2/pedidos/numero-pedidos-cola');
  }

  public obtenerProductosPorPedido(id): Observable<any> {
    return this.http.get(`/api/v2/pedidos/productos/${id}`);
  }

  //POST
  public crearPedido(pedido: Pedido, id?: String): Observable<any> {
    return this.http.post(`/api/v2/pedidos/${id}`, pedido);
  }
  //PATCH
  public tomarPedido(idPedido: string, id: string): Observable<any> {
    return this.http.patch(`/api/v2/pedidos/tomar/${idPedido}/${id}`, null);
  }
  public actualizarEstado(pedido): Observable<any> {
    return this.http.patch('/api/v2/pedidos/estado', pedido);
  }
  public actualizarAnticipo(id, anticipo): Observable<any> {
    return this.http.patch(`/api/v2/pedidos/anticipo/${id}/${anticipo}`, null);
  }
  public eliminarNotificacionPorPedido(num): Observable<any> {
    return this.http.delete(`/api/v2/pedidos/notificaciones/${num}`);
  }

  //sockets
  mandarNotificaciones(pedido: Pedido) {
    this.wsService.emitir('notificaciones', pedido, cb => {
      switch (cb.status) {
        case 'error': this.toastr.abrirToastr('error', cb.detalles, cb.titulo);
      }
    })
  }
  tomarPedidoEnCola(pedido: Pedido) {
    this.wsService.emitir('tomar-pedido', pedido, cb => {
      switch (cb.status) {
        case 'error': this.toastr.abrirToastr('error', cb.detalles, cb.titulo);
      }
    });
  }
  obtenerNotificaciones() {
    return this.wsService.escuchar('obtener-notificaciones');
  }
  obtenerNumPedidosEnCola() {
    return this.wsService.escuchar('obtener-num-pedidos-cola');
  }
  obtenerNuevoPedidoEnCola() {
    return this.wsService.escuchar('obtener-nuevo-pedido-cola');
  }
  quitarPedidoEnCola() {
    return this.wsService.escuchar('quitar-pedido-cola');
  }
}
