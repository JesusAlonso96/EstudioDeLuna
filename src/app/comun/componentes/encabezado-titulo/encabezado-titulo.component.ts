import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-encabezado-titulo',
  templateUrl: './encabezado-titulo.component.html',
  styleUrls: ['./encabezado-titulo.component.scss']
})
export class EncabezadoTituloComponent implements OnInit {
  @Input() titulo: string;
  @Input() color: string;
  constructor() { }

  ngOnInit() {
  }

}
