import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-clientes-restaurar',
  templateUrl: './clientes-restaurar.component.html',
  styleUrls: ['./clientes-restaurar.component.scss']
})
export class ClientesRestaurarComponent {
  @Output() cargandoEventoHijos = new EventEmitter(true);

  constructor() { }
  cargandoEv(evento: any){
    this.cargandoEventoHijos.emit({ cargando:evento.cargando, texto: evento.texto ? evento.texto : '' });
  }
}
