import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class TemasService {
  temas: string[] = ['default', 'tema-rojo', 'tema-azul', 'tema-verde'];
  temasActivo: boolean[] = [];
  constructor(private autenticacionService: ServicioAutenticacionService,
    private http: HttpClient) {
    this.iniciarTemas();
  }
  public iniciarTemas() {
    if (localStorage.getItem('tema-actual') !== null) this.cambiarTema(localStorage.getItem('tema-actual'))
    else this.cambiarTema(this.autenticacionService.getConfiguracionTema())
  }
  public cambiarTema(tema: string) {
    this.inicializarTemas();
    this.temasActivo[this.temas.indexOf(tema)] = true;
    localStorage.setItem('tema-actual', tema);
    this.actualizarTemaUsuario(tema);
  }
  public temaActivo(tema: string): boolean {
    for (let i = 0; i < this.temasActivo.length; i++) {
      if (this.temasActivo[this.temas.indexOf(tema)]) return true;
    }
    return false
  }
  public inicializarTemas() {
    for (let i = 0; i < this.temas.length; i++) {
      this.temasActivo[i] = false;
    }
  }
  public obtenerClaseActiva(): string {
    for (let tema of this.temas) {
      if (this.temaActivo(tema)) return tema;
    }
  }
  public actualizarTemaUsuario(tema: string) {
    return this.http.patch('/api/v1/usuarios/temas', { tema });
  }
}
