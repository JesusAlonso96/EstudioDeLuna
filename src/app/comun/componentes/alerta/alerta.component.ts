import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss']
})
export class AlertaComponent implements OnInit {
  @Input() tipo: string;
  @Input() tipo_bootstrap: string;
  @Input() mensaje: string;
  constructor() { }

  ngOnInit(): void {
  }

}
