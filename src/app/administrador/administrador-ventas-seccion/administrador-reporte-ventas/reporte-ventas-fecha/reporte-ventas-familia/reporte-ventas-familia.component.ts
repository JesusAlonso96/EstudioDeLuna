import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import {  Label } from 'ng2-charts';
import * as momento from 'moment';
import * as pluginDataLabels  from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-reporte-ventas-familia',
  templateUrl: './reporte-ventas-familia.component.html',
  styleUrls: ['./reporte-ventas-familia.component.scss']
})
export class ReporteVentasFamiliaComponent implements OnInit {
  //GRAFICA DE BARRAS
  @Input() datos: any;
  @Input() fechaInicio: any;
  @Input() fechaFin: any;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [''];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [{ data: [100], label: '' }, { data: [100], label: '' }];;
  dataSource = [];
  displayedColumns: string[] = ['familia', 'ventas'];

  constructor() { }

  ngOnInit() {
    
    this.generarGrafica(this.datos);
  }
  generarGrafica(array){
    this.popBarChart();
    this.barChartLabels[0] = `Ventas por familia del ${ momento(this.fechaInicio).locale('es').format('Do [de] MMM  [del] YYYY')} al ${momento(this.fechaFin).locale('es').format('Do [de] MMM  [del] YYYY')}`;
    for (let i = 0; i < array.length; i++) {
      if (this.barChartData[i] == undefined) {
        const random1 = Math.random() * (254 - 0) + 0;
        const random2 = Math.random() * (254 - 0) + 0;
        const random3 = Math.random() * (254 - 0) + 0;
       
        this.barChartData[i] = {
          data: [array[i].cantidad], label: array[i]._id.nombre, backgroundColor: `rgba(${random1},${random2},${random3},0.6)`,
          borderColor: `rgba(${random1},${random2},${random3},1)`,
          hoverBackgroundColor: `rgba(${random1},${random2},${random3},0.8)`,
          hoverBorderColor: `rgba(${random1},${random2},${random3},1)`,
        }
      } else {
        this.barChartData[i].data[0] = array[i].cantidad;
        this.barChartData[i].label = array[i]._id.nombre;
      }

    }
  }
  popBarChart(){
    this.barChartData.splice(0,this.barChartData.length)
}
}
