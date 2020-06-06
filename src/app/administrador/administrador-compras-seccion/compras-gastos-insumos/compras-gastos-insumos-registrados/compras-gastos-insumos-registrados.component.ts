import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { GastoInsumo } from 'src/app/comun/modelos/gasto_insumo.model';
import { GastoInsumoService } from 'src/app/comun/servicios/gasto-insumo.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { AltaGastoInsumoComponent } from 'src/app/comun/componentes/modales/alta-gasto-insumo/alta-gasto-insumo.component';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-compras-gastos-insumos-registrados',
  templateUrl: './compras-gastos-insumos-registrados.component.html',
  styleUrls: ['./compras-gastos-insumos-registrados.component.scss']
})
export class ComprasGastosInsumosRegistradosComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['fechaRegistro', 'fechaCompra', 'numFactura', 'rfcEmisor', 'razonSocial', 'metodoPago', 'subtotal', 'iva', 'costoEnvio', 'total', 'observaciones', 'editar'];
  gastosInsumos: GastoInsumo[];
  cargando: boolean = false;
  
  constructor(private gastoInsumoService: GastoInsumoService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerGastosInsumos();
  }

  obtenerGastosInsumos() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo gastos');
    this.gastoInsumoService.obtenerGastosInsumos().subscribe(
      (gastosInsumos: GastoInsumo[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.gastosInsumos = gastosInsumos;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }
}
