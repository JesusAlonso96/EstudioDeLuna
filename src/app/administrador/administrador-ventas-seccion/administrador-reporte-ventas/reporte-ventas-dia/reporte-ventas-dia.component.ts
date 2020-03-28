import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ListadoVentasMesComponent } from '../reporte-ventas-mes/listado-ventas-mes/listado-ventas-mes.component';

@Component({
  selector: 'app-reporte-ventas-dia',
  templateUrl: './reporte-ventas-dia.component.html',
  styleUrls: ['./reporte-ventas-dia.component.scss']
})
export class ReporteVentasDiaComponent implements OnInit {
  @ViewChild('reporte') reporte: ElementRef;
  @ViewChild('contenido') contenido: ElementRef;

  ventas: any ;
  fecha: Date = new Date(Date.now());
  sinVentas: boolean = false;
  displayedColumns: string[] = ['nota','fecha','cliente','total'];
  dataSource: any;
  constructor(private adminService: AdministradorService,
    private toastr: ToastrService, 
    public dialog: MatDialog) { }

  ngOnInit() {
    this.adminService.obtenerVentasDia().subscribe(
      (ventas) => {
        this.ventas = ventas[0];
        this.dataSource = this.ventas.ventas;
        console.log(this.dataSource);
      },
      (err) => {
        if (err.error.tipo == 0) {
          this.sinVentas = true;
          this.toastr.info(err.error.detalles, err.error.titulo, {
            closeButton: true
          });
        }
      }
    );
  }
  generarReporte() {
    this.dialog.open(ListadoVentasMesComponent, {
      width: '70%',
      data: {ventas: this.ventas, tipoReporte: 0 } //0 igual a reporte de dia
    });
  }

}
