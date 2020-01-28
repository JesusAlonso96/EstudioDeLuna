import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EstadosService {

    constructor(private http: HttpClient) { }

    public obtenerEstados(): Observable<any> {
        return this.http.get('/api/v1/estados/estados');
    }
    public obtenerMunicipios(id: string): Observable<any> {
        return this.http.get(`/api/v1/estados/municipios/${id}`);
    }
}