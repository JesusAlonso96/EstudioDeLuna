import { Component, OnInit, ViewChild } from '@angular/core';
import { GastoGeneral } from 'src/app/comun/modelos/gasto_general.model';
import { GastoGeneralService } from 'src/app/comun/servicios/gasto-general.service';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { AltaGastoGeneralComponent } from 'src/app/comun/componentes/modales/alta-gasto-general/alta-gasto-general.component';

@Component({
  selector: 'app-compras-gastos-generales-detalles',
  templateUrl: './compras-gastos-generales-detalles.component.html',
  styleUrls: ['./compras-gastos-generales-detalles.component.scss']
})
export class ComprasGastosGeneralesDetallesComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['fecha', 'nombre', 'rfcEmisor', 'razonSocial', 'metodoPago', 'subtotal', 'iva', 'ieps', 'total', 'observaciones', 'editar', 'eliminar'];
  gastosGenerales: GastoGeneral[];
  cargando: boolean = false;
  
  constructor(private gastoGeneralService: GastoGeneralService,
    private toastr: NgToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerGastosGenerales();
  }

  obtenerGastosGenerales() {
    this.cargando = true;
    this.gastoGeneralService.obtenerGastosGenerales().subscribe(
      (gastosGenerales: GastoGeneral[]) => {
        this.cargando = false;
        this.gastosGenerales = gastosGenerales;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  nuevoGastoGeneral() {
    const dialogRef = this.dialog.open(AltaGastoGeneralComponent, {
      width: '50%'
    });
    dialogRef.afterClosed().subscribe(gastoGeneral => {
      if (gastoGeneral) {
        this.agregarGastoGeneral(gastoGeneral);
      }
    })
  }

  agregarGastoGeneral(gastoGeneral: GastoGeneral) {
    this.cargando = true;
    this.gastoGeneralService.nuevoGastoGeneral(gastoGeneral).subscribe(
      (gastoGeneral: GastoGeneral) => {
        this.cargando = false;
        this.toastr.abrirToastr('exito',`Se ha agregado exitosamente el gasto general ${gastoGeneral.id}`, 'Gasto general agregado exitosamente');
        this.gastosGenerales.push(gastoGeneral);
        this.buscador.datosTabla.data = this.gastosGenerales;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }
}
