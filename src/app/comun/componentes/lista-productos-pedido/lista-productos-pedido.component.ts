import { Component, OnInit, Input } from '@angular/core';
import { ProductoPedido } from '../../modelos/pedido.model';
import { MatDialog } from '@angular/material';
import { DetallesProductoComponent } from '../modales/detalles-producto/detalles-producto.component';
import { VistaProductoComponent } from '../modales/vista-producto/vista-producto.component';

@Component({
  selector: 'app-lista-productos-pedido',
  templateUrl: './lista-productos-pedido.component.html',
  styleUrls: ['./lista-productos-pedido.component.scss']
})
export class ListaProductosPedidoComponent implements OnInit {
  @Input() productos: ProductoPedido[];
  constructor(private modal: MatDialog) { }

  ngOnInit(): void {
    console.log(this.productos);
  }
  obtenerNombreCantidadProductos(producto: ProductoPedido):string{
    return producto.cantidad == 1 ? producto.cantidad + ' producto' : producto.cantidad + ' productos';
  }
  obtenerTotalPorProducto(producto: ProductoPedido): number {
    return producto.cantidad * producto.precioUnitario;
  }
  verDetallesProducto(producto: ProductoPedido){
    this.modal.open(VistaProductoComponent, {
      maxWidth:'80%',
      width:'50%',
      data:producto
    })
  }
}
