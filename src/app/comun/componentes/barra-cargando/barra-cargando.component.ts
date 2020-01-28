import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-barra-cargando',
  templateUrl: './barra-cargando.component.html',
  styleUrls: ['./barra-cargando.component.scss']
})
export class BarraCargandoComponent implements OnInit {
  @Input() cargando: boolean;
  constructor() { }

  ngOnInit() {
  }

}
