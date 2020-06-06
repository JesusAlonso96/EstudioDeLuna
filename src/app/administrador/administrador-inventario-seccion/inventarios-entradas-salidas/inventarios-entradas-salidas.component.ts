import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Movimiento } from 'src/app/comun/modelos/almacen.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InventariosEntradasSalidasDetallesModalComponent } from './inventarios-entradas-salidas-detalles-modal/inventarios-entradas-salidas-detalles-modal.component';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
@Component({
  selector: 'app-inventarios-entradas-salidas',
  templateUrl: './inventarios-entradas-salidas.component.html',
  styleUrls: ['./inventarios-entradas-salidas.component.scss']
})
export class InventariosEntradasSalidasComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  datosTabla: MatTableDataSource<Movimiento>;
  columnas: string[] = ['fecha', 'almacen', 'insumo', 'tipoMovimiento', 'motivo', 'cantidadMovimiento', 'detalles'];
  cargando: boolean = false;
  contadorInsumosActualizados: number;

  constructor(
    private almacenService: AlmacenService,
    private toastr: NgToastrService,
    private dialog: MatDialog,
    private cargandoService: CargandoService
  ) { }

  ngOnInit() {
    this.obtenerHistorialMovimientos();
  }

  obtenerHistorialMovimientos() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo historial de movimientos');
    this.almacenService.obtenerHistorialMovimientos().subscribe(
      (movimientos: Movimiento[]) => {
        this.inicializarTabla(movimientos);
        this.cargando = this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  inicializarTabla(movimientos: Movimiento[]) {
    this.datosTabla = new MatTableDataSource(movimientos);
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.sort = this.sort;
    this.datosTabla.filterPredicate = (elemento: Movimiento, filtro: string) => {
      return elemento.almacen.nombre.trim().toLowerCase().indexOf(filtro) !== -1
        || elemento.insumo.nombre.trim().toLowerCase().indexOf(filtro) !== -1
        || elemento.tipo.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }

  aplicarFiltroBusqueda() {
    this.datosTabla.filter = this.busquedaElemento.trim().toLowerCase();
  }

  borrarBusqueda() {
    this.busquedaElemento = '';
    this.aplicarFiltroBusqueda();
  }

  esAlta(tipoMovimiento: string) {
    switch (tipoMovimiento) {
      case 'Baja':
      case 'Baja inventario':
      case 'Envio traspaso': return false;
      case 'Traspaso eliminado':
      case 'Alta inventario':
      case 'Recepcion traspaso': return true;
    }
  }

  verDetalles(movimiento: Movimiento) {
    this.dialog.open(InventariosEntradasSalidasDetallesModalComponent, {
      data: movimiento
    });
  }
}