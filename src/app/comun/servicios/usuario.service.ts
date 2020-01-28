import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto.model';
import { Familia } from '../modelos/familia.model';
import { Usuario } from '../modelos/usuario.model';
import { Proveedor } from '../modelos/proveedor.model';
import { ProductoProveedor } from '../modelos/producto_proveedor.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private http: HttpClient) { }
    //post
    public agregarNuevoProducto(producto: Producto): Observable<any> {
        return this.http.post('/api/v1/usuarios/agregarProducto', producto);
    }
    public agregarNuevaFamilia(familia: Familia): Observable<any> {
        return this.http.post('/api/v1/usuarios/agregarFamilia', familia);
    }

    public crearAsistencia(id: string): Observable<any> {
        return this.http.post(`/api/v1/usuarios/crearAsistencia/${id}`, null);
    }
    public nuevoProveedor(proveedor: Proveedor): Observable<any> {
        return this.http.post('/api/v1/usuarios/nuevoProveedor', proveedor);
    }
    public agregarProductoProveedor(producto: ProductoProveedor): Observable<any> {
        return this.http.post('/api/v1/usuarios/agregarProductoProveedor', producto);
    }
    //get
    public obtenerUsuario(id: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerUsuario/${id}`);
    }
    public obtenerUsuarios(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerUsuarios');
    }
    public obtenerPedidosRealizados(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerPedidosRealizados')
    }
    public obtenerFotografos(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerFotografos');
    }
    public obtenerPedidosRealizadosPorFotografo(id: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerPedidosRealizadosPorFotografo/${id}`);
    }
    public obtenerPedidosVendidos(filtro: number): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerPedidosVendidos/${filtro}`);
    }
    public obtenerPedidosVendidosPorFotografo(id: string, filtro: number): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerPedidosVendidosPorFotografo/${id}/${filtro}`);
    }
    public obtenerVentasConRetoquePorFotografo(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerVentasConRetoquePorFotografo');
    }
    public obtenerDesglosePedidosCRetoque(idUsuario: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/desglosarVentasConRetoquePorFotografo/${idUsuario}`);
    }
    public obtenerProveedores(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerProveedores');
    }
    public obtenerListaProveedores(): Observable<any> {
        return this.http.get('/api/v1/usuarios/obtenerListaProveedores');
    }
    public obtenerProductosProveedor(idProveedor: string): Observable<any> {
        return this.http.get(`/api/v1/usuarios/obtenerProductosProveedor/${idProveedor}`);
    }
    //patch
    public actualizarProducto(producto: Producto): Observable<any> {
        return this.http.patch('/api/v1/usuarios/actualizarProducto', producto);
    }
    public eliminarProducto(id: string, idFamilia: string): Observable<any> {
        return this.http.patch(`/api/v1/usuarios/eliminarProducto/${id}/${idFamilia}`, null);
    }
    public eliminarFamilia(id: string): Observable<any> {
        return this.http.patch(`/api/v1/usuarios/eliminarFamilia/${id}`, null);
    }
}