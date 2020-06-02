import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargandoService {
  private emitirFuenteCambio = new Subject<any>();
  cambioEmitido$ = this.emitirFuenteCambio.asObservable();

  constructor() { }
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.emitirFuenteCambio.next({ cargando, texto });
  }
}
