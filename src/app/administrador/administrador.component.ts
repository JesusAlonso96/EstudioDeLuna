import { Component } from '@angular/core';
import { TemasService } from '../comun/servicios/temas.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.scss']
})
export class AdministradorComponent {

  constructor(private temasService: TemasService) { }

}
