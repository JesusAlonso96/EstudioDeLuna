import { Component, OnInit, ViewChild } from '@angular/core';
import { Compra } from 'src/app/comun/modelos/compra.model';
import { CompraService } from 'src/app/comun/servicios/compra.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-compras-gastos-insumos-pendientes',
  templateUrl: './compras-gastos-insumos-pendientes.component.html',
  styleUrls: ['./compras-gastos-insumos-pendientes.component.scss']
})
export class ComprasGastosInsumosPendientesComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['fechaCompra', 'numFactura', 'rfcEmisor', 'razonSocial', 'metodoPago', 'subtotal', 'iva', 'costoEnvio', 'total', 'registrar'];
  comprasSinRegistrar: Compra[];
  cargando: boolean = false;
  
  constructor(private compraService: CompraService,
    private cargandoService: CargandoService,
    private toastr: NgToastrService) { }

  ngOnInit() {
    this.obtenerComprasSinRegistrar();
  }

  obtenerComprasSinRegistrar() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo compras sin registrar');
    this.compraService.obtenerComprasSinRegistrar().subscribe(
      (compras: Compra[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.comprasSinRegistrar = compras;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }
}
