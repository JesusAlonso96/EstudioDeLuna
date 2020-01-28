import { Component, OnInit } from '@angular/core';
import * as momento from 'moment';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ListadoVentasMesComponent } from './listado-ventas-mes/listado-ventas-mes.component';

@Component({
  selector: 'app-reporte-ventas-mes',
  templateUrl: './reporte-ventas-mes.component.html',
  styleUrls: ['./reporte-ventas-mes.component.scss']
})
export class ReporteVentasMesComponent implements OnInit {
  anio: string = '';
  mes: number;
  fechaInicio: string = '';
  fechaFin: string = '';
  constructor(public dialog: MatDialog, private adminService: AdministradorService, private toastr: ToastrService) { }

  ngOnInit() { }
  obtenerFechaInicio(): number {
    const fecha = new Date(`${this.anio}/${this.mes}/01`);
    this.fechaInicio = momento(fecha).locale('es').format();
    return momento(fecha).daysInMonth();
  }
  obtenerFechaFin(): void {
    const fechaFin = new Date(`${this.anio}/${this.mes}/${this.obtenerFechaInicio()}`);
    this.fechaFin = momento(fechaFin).locale('es').format();
  }
  abrirModal(datos): void {
    this.dialog.open(ListadoVentasMesComponent, {
      width: '70%',
      data: { ventas: datos, tipoReporte: 1 }
    });
  }
  generarReporte() {
    this.obtenerFechaFin();
    this.adminService.obtenerVentasMes(this.fechaInicio, this.fechaFin).subscribe(
      (res) => {
        this.abrirModal(res);
      },
      (err) => {
        if (err.error.tipo == 0) {
          this.toastr.info(err.error.detalles, err.error.titulo, {
            closeButton: true
          })
        }
      }
    );
  }
}
