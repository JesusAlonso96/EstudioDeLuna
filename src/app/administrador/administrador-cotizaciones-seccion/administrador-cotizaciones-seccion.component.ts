import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administrador-cotizaciones-seccion',
  templateUrl: './administrador-cotizaciones-seccion.component.html',
  styleUrls: ['./administrador-cotizaciones-seccion.component.scss']
})
export class AdministradorCotizacionesSeccionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  hola(){
    console.log("sirve el click")
  }
}
