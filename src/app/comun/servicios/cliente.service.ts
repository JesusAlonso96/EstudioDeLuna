import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../modelos/cliente.model';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    constructor(private http: HttpClient) { }
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
    public eliminarCliente(idCliente: string): Observable<any> {
        return this.http.patch(`/api/v1/clientes/eliminarCliente/${idCliente}`, null);
    }
    public editarCliente(cliente: Cliente): Observable<any> {
        return this.http.patch('/api/v1/clientes/actualizarCliente', cliente);
    }
    public restaurarCliente(idCliente: string): Observable<any> {
        return this.http.patch(`/api/v1/clientes/restaurarCliente/${idCliente}`, null);
    }

}