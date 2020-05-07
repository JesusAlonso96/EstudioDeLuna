import { Component, Input, OnInit } from '@angular/core';
import { Animaciones } from 'src/app/comun/constantes/animaciones';

@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.component.html',
  styleUrls: ['./cargando.component.scss'],
  animations: [
    Animaciones.carga
  ]
})
export class CargandoComponent implements OnInit {
  @Input() texto: string;
  @Input() cargando: boolean;
  constructor() { }

  ngOnInit() {
  }

}
