import { Component, OnInit } from '@angular/core';
import { TiposReporte } from 'src/app/comun/enumeraciones/tipos-reporte.enum';
import { Meses } from 'src/app/comun/enumeraciones/meses.enum';
import * as momento from 'moment';
import { ANIO_BASE_REPORTES } from 'src/app/comun/constantes/anio-base-reportes';
import { GastoInsumoService } from 'src/app/comun/servicios/gasto-insumo.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatDialog } from '@angular/material';
import { GastoInsumo } from 'src/app/comun/modelos/gasto_insumo.model';
import { HttpErrorResponse } from '@angular/common/http';
import { GastoGeneralService } from 'src/app/comun/servicios/gasto-general.service';

@Component({
  selector: 'app-reportes-compras',
  templateUrl: './reportes-compras.component.html',
  styleUrls: ['./reportes-compras.component.scss']
})
export class ReportesComprasComponent implements OnInit {
  TiposReporte = TiposReporte;
  Meses = Meses;
  tipoReporte: number;
  anios: number[] = [];
  dias: number[] = [];
  anioSeleccionado: number;
  mesSeleccionado: number;
  diaSeleccionado: number;

  /* VARIABLES DEL PRIMER REPORTE */
  cargandoGastosInsumos: boolean;
  cargandoGastosGenerales: boolean;
  datosReportePorFecha = [
    {
      "name": "Compras",
      "series": []
    },
    {
      "name": "Gastos generales",
      "series": []
    }
  ];

  vistaReportePorFecha: any[] = [700, 300];
  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string;
  yAxisLabel: string = 'Monto';
  timeline: boolean = true;
  coloresReportePorFecha = {
    domain: ['#5AA454', '#E44D25']
  };

  /* VARIABLES DEL SEGUNDO REPORTE */
  cargandoGastosGeneralesPorTipoDeGastoGeneral: boolean;
  datosReportePorTipoGastoGeneral: any[];
  vistaReportePorTipoGastoGeneral: any[] = [700, 200];
  mostrarLeyendasReportePorTipoGastoGeneral: boolean = true;
  mostrarEtiquetasReportePorTipoGastoGeneral: boolean = true;
  coloresReportePorTipoGastoGeneral = {
    domain: []
  };
  colorReportePorTipoGastoGeneral1: string = '#CFC0BB';
  colorReportePorTipoGastoGeneral2: string = '#7aa3e5';

  /* VARIABLES DEL TERCER REPORTE */
  cargandoGastosInsumosPorProveedor: boolean;
  datosReportePorProveedor: any[];
  vistaReportePorProveedor: any[] = [700, 200];
  mostrarLeyendasReportePorProveedor: boolean = true;
  mostrarEtiquetasReportePorProveedor: boolean = true;
  coloresReportePorProveedor = {
    domain: []
  };
  colorReportePorProveedor1: string = '#a8385d';
  colorReportePorProveedor2: string = '#aae3f5';

  constructor(private gastoInsumoService: GastoInsumoService,
    private gastoGeneralesService: GastoGeneralService,
    private toastr: NgToastrService,
    private dialog: MatDialog) {
    this.tipoReporte = TiposReporte.Anual;
    this.inicializarAnios();
    this.inicializarDatos();
  }

  ngOnInit() {
    this.obtenerReportes();
  }

  obtenerReportes() {
    this.obtenerReporteGastosInsumosPorFecha();
    this.obtenerReporteGastosInsumosPorProveedor();
    this.obtenerReporteGastosGeneralesPorFecha();
    this.obtenerReporteGastosGeneralesPorTipoGastoGeneral();
  }

  obtenerReporteGastosInsumosPorFecha() {
    this.cargandoGastosInsumos = true;
    this.gastoInsumoService.obtenerReporteGastosInsumosPorFecha(this.tipoReporte, this.anioSeleccionado, this.mesSeleccionado, this.diaSeleccionado).subscribe(
      (datosGastosInsumo: any[]) => {
        switch (this.tipoReporte) {
          case TiposReporte.Anual:
            this.inicializarDatosGraficaPorFecha(datosGastosInsumo, 0, 1, 12, 'Meses');
            break;
          case TiposReporte.Mensual:
            this.inicializarDatosGraficaPorFecha(datosGastosInsumo, 0, 1, this.obtenerDiaMaximoDelMes(), 'Días');
            break;
          case TiposReporte.Diario:
            this.inicializarDatosGraficaPorFecha(datosGastosInsumo, 0, 0, 23, 'Horas');
            break;
        }
        this.cargandoGastosInsumos = false;
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerReporteGastosInsumosPorProveedor() {
    this.cargandoGastosInsumosPorProveedor = true;
    this.gastoInsumoService.obtenerReporteGastosInsumosPorProveedor(this.tipoReporte, this.anioSeleccionado, this.mesSeleccionado, this.diaSeleccionado).subscribe(
      (datosGastosInsumos: any[]) => {
        this.inicializarDatosGraficaPorProveedores(datosGastosInsumos)
        this.cargandoGastosInsumosPorProveedor = false;
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerReporteGastosGeneralesPorFecha() {
    this.cargandoGastosGenerales = true;
    this.gastoGeneralesService.obtenerReporteGastosGeneralesPorFecha(this.tipoReporte, this.anioSeleccionado, this.mesSeleccionado, this.diaSeleccionado).subscribe(
      (datosGastosGenerales: any[]) => {
        switch (this.tipoReporte) {
          case TiposReporte.Anual:
            this.inicializarDatosGraficaPorFecha(datosGastosGenerales, 1, 1, 12, 'Meses');
            break;
          case TiposReporte.Mensual:
            this.inicializarDatosGraficaPorFecha(datosGastosGenerales, 1, 1, this.obtenerDiaMaximoDelMes(), 'Días');
            break;
          case TiposReporte.Diario:
            this.inicializarDatosGraficaPorFecha(datosGastosGenerales, 1, 0, 23, 'Horas');
            break;
        }
        this.cargandoGastosGenerales = false;
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerReporteGastosGeneralesPorTipoGastoGeneral() {
    this.cargandoGastosGeneralesPorTipoDeGastoGeneral = true;
    this.gastoGeneralesService.obtenerReporteGastosGeneralesPorTipoGastoGeneral(this.tipoReporte, this.anioSeleccionado, this.mesSeleccionado, this.diaSeleccionado).subscribe(
      (datosGastosGenerales: any[]) => {
        this.inicializarDatosGraficaPorTipoGastoGeneral(datosGastosGenerales)
        this.cargandoGastosGeneralesPorTipoDeGastoGeneral = false;
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  inicializarDatosGraficaPorFecha(datos: any[], posicionDatosReporte: number, inicioConteo: number, finConteo: number, etiquetaX: string) {
    this.xAxisLabel = etiquetaX;
    this.datosReportePorFecha[posicionDatosReporte].series = [];
    for (let i = inicioConteo; i <= finConteo; i++) {
      let posicionDato = datos.findIndex(dato => {
        return dato._id == i;
      })
      let nombre = finConteo == 12 ? this.obtenerMes(i) : i;
      if (posicionDato != -1) {
        this.datosReportePorFecha[posicionDatosReporte].series.push({
          name: nombre,
          value: Number(datos[posicionDato].total)
        })
      } else {
        this.datosReportePorFecha[posicionDatosReporte].series.push({
          name: nombre,
          value: 0
        })
      }
    }
  }

  inicializarDatosGraficaPorTipoGastoGeneral(datos: any[]) {
    this.datosReportePorTipoGastoGeneral = [];
    this.coloresReportePorTipoGastoGeneral.domain = [];
    datos.forEach((dato, posicionDato) => {
      this.datosReportePorTipoGastoGeneral.push({
        name: dato._id.nombre,
        value: dato.total
      });
      if (posicionDato % 2 == 0) {
        this.coloresReportePorTipoGastoGeneral.domain.push(this.colorReportePorTipoGastoGeneral1);
      } else {
        this.coloresReportePorTipoGastoGeneral.domain.push(this.colorReportePorTipoGastoGeneral2);
      }
    });
  }

  inicializarDatosGraficaPorProveedores(datos: any[]) {
    this.datosReportePorProveedor = [];
    this.coloresReportePorProveedor.domain = [];
    datos.forEach((dato, posicionDato) => {
      this.datosReportePorProveedor.push({
        name: dato._id.nombre,
        value: dato.total
      });
      if (posicionDato % 2 == 0) {
        this.coloresReportePorProveedor.domain.push(this.colorReportePorProveedor1);
      } else {
        this.coloresReportePorProveedor.domain.push(this.colorReportePorProveedor2);
      }
    });
  }

  inicializarAnios() {
    const anioActual: number = (new Date(Date.now())).getFullYear();
    for (let anio = ANIO_BASE_REPORTES; anio <= anioActual; anio++) {
      this.anios.push(anio);
    }
  }

  inicializarDatos() {
    switch (this.tipoReporte) {
      case TiposReporte.Anual: this.anioSeleccionado = this.anios[0];
        this.mesSeleccionado = null;
        this.diaSeleccionado = null;
        break;
      case TiposReporte.Mensual: if (!this.mesSeleccionado) {
        this.mesSeleccionado = Meses.Enero;
      }
        this.diaSeleccionado = null;
        break;
      case TiposReporte.Diario: if (!this.mesSeleccionado) {
        this.mesSeleccionado = Meses.Enero;
      }
        this.inicializarDias();
        this.diaSeleccionado = this.dias[0];
        break;
    }
  }

  inicializarDias() {
    this.dias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    const diaMaximo: number = this.obtenerDiaMaximoDelMes();
    for (let i = 29; i <= diaMaximo; i++) {
      this.dias.push(i);
    }
  }

  obtenerTipoReporte(tipoReporte: number) {
    switch (tipoReporte) {
      case TiposReporte.Anual: return 'Anual';
      case TiposReporte.Mensual: return 'Mensual';
      case TiposReporte.Diario: return 'Diario';
    }
  }

  obtenerMes(mes: number) {
    switch (mes) {
      case Meses.Enero: return 'Enero';
      case Meses.Febrero: return 'Febrero';
      case Meses.Marzo: return 'Marzo';
      case Meses.Abril: return 'Abril';
      case Meses.Mayo: return 'Mayo';
      case Meses.Junio: return 'Junio';
      case Meses.Julio: return 'Julio';
      case Meses.Agosto: return 'Agosto';
      case Meses.Septiembre: return 'Septiembre';
      case Meses.Octubre: return 'Octubre';
      case Meses.Noviembre: return 'Noviembre';
      case Meses.Diciembre: return 'Diciembre';
    }
  }

  obtenerDiaMaximoDelMes() {
    return (new Date(this.anioSeleccionado, this.mesSeleccionado, 0)).getDate();
  }

  onSelect(event) {
    console.log(event);
  }
}
