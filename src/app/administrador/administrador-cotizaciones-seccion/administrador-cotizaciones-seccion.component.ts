import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrador-cotizaciones-seccion',
  templateUrl: './administrador-cotizaciones-seccion.component.html',
  styleUrls: ['./administrador-cotizaciones-seccion.component.scss']
})
export class AdministradorCotizacionesSeccionComponent implements OnInit {
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
