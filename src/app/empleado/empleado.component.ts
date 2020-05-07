import { Component, OnInit } from '@angular/core';
import { TemasService } from '../comun/servicios/temas.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements OnInit {

  constructor(public temasService: TemasService) { }

  ngOnInit() {
  }

}
