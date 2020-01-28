import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { Pedido } from '../../modelos/pedido.model';
import { DetallesProductoComponent } from '../modales/detalles-producto/detalles-producto.component';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.scss']
})
export class ListaPedidosComponent implements OnInit {
  @Input() pedidos: Pedido[];
  url_fotos: string = environment.url_fotos;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }
  verProductos(pedido: Pedido) {
    this.dialog.open(DetallesProductoComponent, {
      data: { pedido, tipo: 1 }
    })
  }
}
