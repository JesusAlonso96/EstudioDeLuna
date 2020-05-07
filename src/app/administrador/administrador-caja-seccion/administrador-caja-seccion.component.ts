import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrador-caja-seccion',
  templateUrl: './administrador-caja-seccion.component.html',
  styleUrls: ['./administrador-caja-seccion.component.scss']
})
export class AdministradorCajaSeccionComponent implements OnInit {
  cargando: any = {
    cargando: false,
    texto: ''
  }
  constructor() { }

  ngOnInit() {
  }
  cargandoEv(evento: any) {
    this.cargando.cargando = evento.cargando;
    this.cargando.texto = evento.texto;
  }

}
