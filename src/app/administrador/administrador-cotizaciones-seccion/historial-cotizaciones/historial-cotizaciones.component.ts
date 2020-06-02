import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { VerCotizacionComponent } from 'src/app/comun/componentes/modales/ver-cotizacion/ver-cotizacion.component';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import { Cotizacion } from 'src/app/comun/modelos/cotizacion.model';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { CotizacionesService } from 'src/app/comun/servicios/cotizaciones.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-historial-cotizaciones',
  templateUrl: './historial-cotizaciones.component.html',
  styleUrls: ['./historial-cotizaciones.component.scss'],
  animations: [Animaciones.carga]
})
export class HistorialCotizacionesComponent implements OnInit {
  cotizaciones: Cotizacion[] = [];
  filtroCotizaciones: Observable<Cotizacion[]>;
  page_size: number = 10;
  page_number: number = 1;
  busquedaCotizacion: string = '';
  constructor(
    public cotizacionService: CotizacionesService, 
    private toastr: NgToastrService, 
    private dialog: MatDialog,
    private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerCotizacionesRealizadas();
  }
  obtenerCotizacionesRealizadas() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo cotizaciones...')
    this.cotizacionService.obtenerCotizacionesRealizadas().subscribe(
      (cotizaciones: Cotizacion[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.cotizaciones = cotizaciones;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );
  }
  descargarCotizacion(cotizacion: Cotizacion) {
    this.dialog.open(VerCotizacionComponent, {
      data: cotizacion
    })
  }
  manejarPaginacion(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }
  borrarBusqueda() {
    this.busquedaCotizacion = '';
  }
}
