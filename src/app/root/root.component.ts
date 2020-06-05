import { Component, OnInit } from '@angular/core';
import { TemasService } from '../comun/servicios/temas.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  constructor(public temasService: TemasService) { }

  ngOnInit() {
  }

}
