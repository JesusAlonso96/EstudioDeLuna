import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Cotizacion } from '../../modelos/cotizacion.model';
import { ProductoCot } from '../../modelos/producto_cot.model';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-cotizacion-creada',
  templateUrl: './cotizacion-creada.component.html',
  styleUrls: ['./cotizacion-creada.component.scss']
})
export class CotizacionCreadaComponent implements OnInit {
  @Input() cotizacion: Cotizacion;
  displayedColumns: string[] = ['cantidad', 'descripcion', 'precio', 'subtotal'];
  listData: MatTableDataSource<ProductoCot>;
  constructor(public usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.inicializarTabla();
  }

  inicializarTabla() {
    this.listData = new MatTableDataSource(this.cotizacion.productos);
  }

}
