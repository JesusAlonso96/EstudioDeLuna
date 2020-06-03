import { Component, OnInit, ViewChild } from '@angular/core';
import { GastoInsumo } from 'src/app/comun/modelos/gasto_insumo.model';
import { GastoInsumoService } from 'src/app/comun/servicios/gasto-insumo.service';
import { AltaGastoInsumoComponent } from 'src/app/comun/componentes/modales/alta-gasto-insumo/alta-gasto-insumo.component';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-compras-gastos-insumos',
  templateUrl: './compras-gastos-insumos.component.html',
  styleUrls: ['./compras-gastos-insumos.component.scss']
})
export class ComprasGastosInsumosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
