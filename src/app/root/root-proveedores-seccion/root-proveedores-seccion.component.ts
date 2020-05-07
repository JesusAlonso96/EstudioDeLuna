import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root-proveedores-seccion',
  templateUrl: './root-proveedores-seccion.component.html',
  styleUrls: ['./root-proveedores-seccion.component.scss']
})
export class RootProveedoresSeccionComponent implements OnInit {
  cargando: any = {
    cargando: false,
    texto: ''
  }
  constructor() { }

  ngOnInit(): void {
  }
  cargandoEv(evento: any) {
    this.cargando.cargando = evento.cargando;
    this.cargando.texto = evento.texto;
  }
}
