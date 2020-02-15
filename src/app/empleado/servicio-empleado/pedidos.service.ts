import { Injectable } from '@angular/core';
import { WebSocketService } from '../../comun/servicios/websocket.service';
import { HttpClient } from '@angular/common/http';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class PedidosService {
    constructor(public wsService: WebSocketService, private http: HttpClient, private toastr: ToastrService) { }

    mandarNotificaciones(pedido: Pedido) {
        this.wsService.emitir('notificaciones', pedido, cb => {
            switch (cb.status) {
                case 'error': this.toastr.error(cb.detalles, cb.titulo, { closeButton: true });
            }
        })
    }
    tomarPedidoEnCola(pedido: Pedido) {
        this.wsService.emitir('tomar-pedido', pedido, cb => {
            switch (cb.status) {
                case 'error': this.toastr.error(cb.detalles, cb.titulo, { closeButton: true });
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