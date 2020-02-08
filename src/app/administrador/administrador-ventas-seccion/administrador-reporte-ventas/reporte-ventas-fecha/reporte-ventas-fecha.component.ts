import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as momento from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reporte-ventas-fecha',
  templateUrl: './reporte-ventas-fecha.component.html',
  styleUrls: ['./reporte-ventas-fecha.component.scss']
})
export class ReporteVentasFechaComponent implements OnInit {
  //GRAFICA
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  public lineChartData: ChartDataSets[] = [
    { data: [10, 10, 10, 10, 10, 10, 10], label: 'Vendido' }
  ];
  public lineChartLabels: Label[] = ['-', '-', '-', '-', '-', '-', '-'];
  public lineChartOptions: ChartOptions = {
    responsive: true
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  //VARIABLES
  datosFamilia: any;
  fechaInicio: string = '';
  fechaFin: string = '';
  promedioCliente: number = 0;
  promedioPorCliente: number = 0;
  promedioVentas: number = 0;
  total: number = 0;
  dataSource: any;
  displayedColumns: string[] = ['fecha', 'clientes', 'ventas'];
  dataSource2: any;
  displayedColumns2: string[] = ['id', 'producto', 'precio', 'cantidad'];
  cargando: boolean = false;
  constructor(private adminService: AdministradorService,
    private toastr: ToastrService) {
  }

  @ViewChild('contenido', { static: false }) contenido: ElementRef;

  ngOnInit() {
  }
  descargarReporte() {
    html2canvas(this.contenido.nativeElement).then(canvas => {
      var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
      pdf.save('reporte.pdf');

    });
  }
  agregarFechaInicio(fecha) {
    this.fechaInicio = momento(fecha.value._d).format();
  }
  agregarFechaFinal(fecha) {
    this.fechaFin = momento(fecha.value._d).format();
  }
  generarGrafica() {
    this.datosFamilia = undefined;
    this.obtenerVentasEnRango();
    this.obtenerMasVendidos();
    this.obtenerVentasPorFamilia();
  }
  obtenerVentasEnRango() {
    this.cargando = true;
    this.adminService.obtenerVentasRango(this.fechaInicio, this.fechaFin).subscribe(
      (respuesta) => {
        this.cargando = false;
        this.asignarValoresGrafica(respuesta);
        this.obtenerDatosPromedio(respuesta)
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true })
      }
    );
  }
  obtenerMasVendidos() {
    this.cargando = true;
    this.adminService.obtener10MasVendidos(this.fechaInicio, this.fechaFin).subscribe(
      (respuesta) => {
        this.dataSource2 = respuesta;
        this.cargando = false;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true })
      }
    );
  }
  obtenerVentasPorFamilia() {
    this.cargando = true;
    this.adminService.obtenerVentasPorFamilia(this.fechaInicio, this.fechaFin).subscribe(
      (array) => {
        this.cargando = false;
        this.datosFamilia = array;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo);
      }
    );
  }
  validDates() {
    if (this.fechaInicio == '' || this.fechaFin == '') {
      return false;
    }
    return true;
  }
  obtenerDatosPromedio(array) {
    let total = 0;
    let totalClientes = 0;
    for (let i = 0; i < array.length; i++) {
      total += array[i].montoTotal;
      totalClientes += array[i].clientes;
    }
    this.total = total;
    this.promedioVentas = (total / array.length);
    this.promedioCliente = Math.round((totalClientes / array.length));
    this.promedioPorCliente = (this.promedioVentas / this.promedioCliente);
  }

  asignarValoresGrafica(resp) {
    this.popAllData();
    this.lineChartLabels = [];
    for (let i = 0; i < resp.length; i++) {
      this.lineChartLabels[i] = momento(resp[i]._id).add(1, 'day').format('L');
      resp[i]._id = momento(resp[i]._id).add(1, 'day').format('L');
      this.lineChartData[0].data.push(resp[i].montoTotal);
    }
    this.dataSource = resp;
  }
  //FUNCIONES PARA LA GRAFICA
  popAllData() {
    for (let i = 0; this.lineChartData[0].data.length; i++) {
      this.lineChartData[0].data.pop();
    }
  }
  // eventos
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
