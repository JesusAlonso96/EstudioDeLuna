import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../modelos/cliente.model';
import { WebSocketService } from './websocket.service';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    constructor(private http: HttpClient, private wsService: WebSocketService) { }

    //post
    public registrarCliente(cliente: Cliente): Observable<any> {
        return this.http.post('/api/v1/clientes/registrar', cliente);
    }
    //get
    public obtenerClientes(): Observable<any> {
        return this.http.get('/api/v1/clientes');
    }
    public obtenerClientePorEmailYNombre(nombre, email): Observable<any> {
        return this.http.get(`/api/v1/clientes/obtenerClientePorEmailNombre/${nombre}/${email}`);
    }
    public obtenerDatosClientes(): Observable<any> {
        return this.http.get('/api/v1/clientes/obtenerDatosClientes');
    }
    public obtenerPedidosCliente(idCliente: string): Observable<any> {
        return this.http.get(`/api/v1/clientes/obtenerPedidosCliente/${idCliente}`);
    }
    public obtenerClientesEliminados(): Observable<any> {
        return this.http.get('/api/v1/clientes/obtenerClientesEliminados');
    }
    //patch
    public eliminarCliente(cliente: Cliente): Observable<any> {
        return this.http.patch('/api/v1/clientes/eliminarCliente', cliente);
    }
    public editarCliente(cliente: Cliente): Observable<any> {
        return this.http.patch('/api/v1/clientes/actualizarCliente', cliente);
    }
    public restaurarCliente(cliente: Cliente): Observable<any> {
        return this.http.patch('/api/v1/clientes/restaurarCliente', cliente);
    }
    /* Seccion de clientes para sockets */
    public escucharNuevoCliente() {
        return this.wsService.escuchar('nuevo-cliente');
    }
    public escucharNuevoClienteEliminado() {
        return this.wsService.escuchar('nuevo-cliente-eliminado');
    }
    public escucharNuevoClienteEditado() {
        return this.wsService.escuchar('nuevo-cliente-editado');
    }
    public escucharNuevoClienteRestaurado() {
        return this.wsService.escuchar('nuevo-cliente-restaurado');
    }
}