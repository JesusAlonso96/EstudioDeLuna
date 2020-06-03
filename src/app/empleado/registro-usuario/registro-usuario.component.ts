import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss']
})
export class RegistroUsuarioComponent implements OnInit {
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
