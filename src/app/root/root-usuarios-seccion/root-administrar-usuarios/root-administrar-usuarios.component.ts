import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';

@Component({
  selector: 'app-root-administrar-usuarios',
  templateUrl: './root-administrar-usuarios.component.html',
  styleUrls: ['./root-administrar-usuarios.component.scss']
})
export class RootAdministrarUsuariosComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'borrar','editar',''];

  constructor() { }

  ngOnInit() {
  }

}
