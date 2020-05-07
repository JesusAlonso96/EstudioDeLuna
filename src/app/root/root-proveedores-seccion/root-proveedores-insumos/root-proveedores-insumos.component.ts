import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-root-proveedores-insumos',
  templateUrl: './root-proveedores-insumos.component.html',
  styleUrls: ['./root-proveedores-insumos.component.scss']
})
export class RootProveedoresInsumosComponent implements OnInit {
  @Output() cargandoEventoHijos = new EventEmitter(true);

  constructor() { }

  ngOnInit(): void {
  }
  cargandoEv(evento: any){
    this.cargandoEventoHijos.emit({ cargando:evento.cargando, texto: evento.texto ? evento.texto : '' });
  }
}
