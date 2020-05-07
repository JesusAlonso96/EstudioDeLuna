import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrador-tablero-seccion',
  templateUrl: './administrador-tablero-seccion.component.html',
  styleUrls: ['./administrador-tablero-seccion.component.scss']
})
export class AdministradorTableroSeccionComponent implements OnInit {
  icargando = {
    cargando: false,
    texto: 'asdfasdf'
  }
  constructor() { }

  ngOnInit() {
    this.icargando.texto = 'asdasdasdasdasd'
  }
  cargando(evento: any) {
    this.icargando.cargando = evento.cargando;
    this.icargando.texto = evento.texto;
  }

}
