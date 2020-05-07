import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-clientes-alta',
  templateUrl: './clientes-alta.component.html',
  styleUrls: ['./clientes-alta.component.scss']
})
export class ClientesAltaComponent {
  @Output() cargandoEventoHijos = new EventEmitter(true);

  constructor() { }
  cargandoEv(evento: any){
    this.cargandoEventoHijos.emit({ cargando:evento.cargando, texto: evento.texto ? evento.texto : '' });
  }
}
