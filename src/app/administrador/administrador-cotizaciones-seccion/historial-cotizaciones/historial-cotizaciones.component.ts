import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Cotizacion } from 'src/app/comun/modelos/cotizacion.model';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { ProductoCot } from 'src/app/comun/modelos/producto_cot.model';
import { VerCotizacionComponent } from 'src/app/comun/componentes/modales/ver-cotizacion/ver-cotizacion.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-historial-cotizaciones',
  templateUrl: './historial-cotizaciones.component.html',
  styleUrls: ['./historial-cotizaciones.component.scss']
})
export class HistorialCotizacionesComponent implements OnInit {
  cotizaciones: Cotizacion[] = [];
  filtroCotizaciones: Observable<Cotizacion[]>;
  cargando: boolean = false;
  displayedColumns: string[] = ['cantidad', 'descripcion', 'precio', 'subtotal'];
  listData: MatTableDataSource<ProductoCot>;
  panelAbierto: boolean[] = [];
  page_size: number = 10;
  page_number: number = 1;
  busquedaCotizacion: string = '';
  constructor(public usuarioService: UsuarioService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    //this.listData = new MatTableDataSource(this.cotizacion)
    this.obtenerCotizacionesRealizadas();
  }
  obtenerCotizacionesRealizadas() {
    this.cargando = true;
    this.usuarioService.obtenerCotizacionesRealizadas().subscribe(
      (cotizaciones: Cotizacion[]) => {
        this.cargando = false;
        this.cotizaciones = cotizaciones;
        this.inicializarPaneles();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  inicializarPaneles() {
    for (let i = 0; i < this.cotizaciones.length; i++) {
      this.panelAbierto[i] = false;
    }
  }
  inicializarTabla(cotizacion: Cotizacion) {
    const indice = this.cotizaciones.indexOf(cotizacion);
    this.listData = new MatTableDataSource(this.cotizaciones[indice].productos);
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
  borrarBusqueda(){
    this.busquedaCotizacion = '';
  }
}
