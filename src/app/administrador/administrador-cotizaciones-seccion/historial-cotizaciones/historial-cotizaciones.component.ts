import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { VerCotizacionComponent } from 'src/app/comun/componentes/modales/ver-cotizacion/ver-cotizacion.component';
import { Cotizacion } from 'src/app/comun/modelos/cotizacion.model';
import { ProductoCot } from 'src/app/comun/modelos/producto_cot.model';
import { CotizacionesService } from 'src/app/comun/servicios/cotizaciones.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Animaciones } from 'src/app/comun/constantes/animaciones';

@Component({
  selector: 'app-historial-cotizaciones',
  templateUrl: './historial-cotizaciones.component.html',
  styleUrls: ['./historial-cotizaciones.component.scss'],
  animations: [Animaciones.carga]
})
export class HistorialCotizacionesComponent implements OnInit {
  @Output() cargandoEvento = new EventEmitter(true);
  cotizaciones: Cotizacion[] = [];
  filtroCotizaciones: Observable<Cotizacion[]>;
  page_size: number = 10;
  page_number: number = 1;
  busquedaCotizacion: string = '';
  constructor(public cotizacionService: CotizacionesService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerCotizacionesRealizadas();
  }
  obtenerCotizacionesRealizadas() {
    this.crearVistaCargando(true, 'Obteniendo cotizaciones...')
    this.cotizacionService.obtenerCotizacionesRealizadas().subscribe(
      (cotizaciones: Cotizacion[]) => {
        this.crearVistaCargando(false);
        this.cotizaciones = cotizaciones;
      },
      (err: HttpErrorResponse) => {
        this.crearVistaCargando(false);
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
}
