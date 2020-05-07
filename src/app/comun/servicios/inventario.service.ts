import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../modelos/inventario.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InventarioService {

    constructor(private http: HttpClient) { }

    //get
    public obtenerInventarios(): Observable<any> {
        return this.http.get('/api/v1/inventarios');
    }
    public obtenerInventarioPorId(id: string): Observable<any> {
        return this.http.get(`/api/v1/inventarios/${id}`)
    }
    //post 
    public nuevoInventario(inventario: Inventario): Observable<any> {
        return this.http.post('/api/v1/inventarios', inventario);
    }
}
