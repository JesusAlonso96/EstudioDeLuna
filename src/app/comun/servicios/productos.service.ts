import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto.model';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {

    constructor(private http: HttpClient) { }

    public obtenerFamiliasProductos(): Observable<any> {
        return this.http.get('/api/v1/productos/familias');
    }
    public obtenerProductos(id: string): Observable<any>{
        return this.http.get(`/api/v1/productos/obtenerProductos/${id}`);
    }
    public obtenerProductosPorCantidad(idFamilia: string): Observable<any>{
        return this.http.get(`/api/v1/productos/obtenerProductosPorCantidad/${idFamilia}`)
    }
    public obtenerProductosPorTam(id: string): Observable<any>{
        return this.http.get(`/api/v1/productos/obtenerProductosPorTam/${id}`)
    }
    public obtenerProductosPorFamilia(): Observable<any>{
        return this.http.get('/api/v1/productos/obtenerFamiliasYProductos')
    }
    public buscarProducto(especificaciones: Producto): Observable<any>{
        return this.http.post('/api/v1/productos/buscarProducto', especificaciones);
    }
    public buscarProductoPorTam(ancho,alto): Observable<any>{
        return this.http.get(`/api/v1/productos/buscarProductoPorTam/${ancho}/${alto}`);
    }
}