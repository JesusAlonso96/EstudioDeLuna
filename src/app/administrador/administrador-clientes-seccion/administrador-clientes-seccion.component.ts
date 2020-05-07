import { Component } from '@angular/core';

@Component({
  selector: 'app-administrador-clientes-seccion',
  templateUrl: './administrador-clientes-seccion.component.html',
  styleUrls: ['./administrador-clientes-seccion.component.scss'],

})
export class AdministradorClientesSeccionComponent {
  cargando: any = {
    cargando: false,
    texto: ''
  }
  constructor() { }
  cargandoEv(evento: any) {
    this.cargando.cargando = evento.cargando;
    this.cargando.texto = evento.texto;
  }
}
