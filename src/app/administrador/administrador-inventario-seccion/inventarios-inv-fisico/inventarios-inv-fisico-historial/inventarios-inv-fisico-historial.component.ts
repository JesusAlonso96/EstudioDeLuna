import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Inventario } from 'src/app/comun/modelos/inventario.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { InventarioService } from 'src/app/comun/servicios/inventario.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InventariosInvFisicoHistorialExistenciasModalComponent } from './inventarios-inv-fisico-historial-existencias-modal/inventarios-inv-fisico-historial-existencias-modal.component';
import { Almacen } from 'src/app/comun/modelos/almacen.model';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-inventarios-inv-fisico-historial',
  templateUrl: './inventarios-inv-fisico-historial.component.html',
  styleUrls: ['./inventarios-inv-fisico-historial.component.scss']
})
export class InventariosInvFisicoHistorialComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  datosTabla: MatTableDataSource<Inventario>;
  columnas: string[] = ['id', 'fechaRegistro', 'almacen', 'usuario', 'existencias'];
  cargando: boolean = false;

  constructor(
    private almacenService: AlmacenService,
    private inventarioService: InventarioService,
    private toastr: NgToastrService,
    private dialog: MatDialog,
    private cargandoService: CargandoService
  ) { }

  ngOnInit() {
    this.obtenerInventarios();
  }

  obtenerInventarios() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo inventarios');
    this.inventarioService.obtenerInventarios().subscribe(
      (inventarios: Inventario[]) => {
        this.inicializarTabla(inventarios);
        this.cargando = this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  inicializarTabla(inventarios: Inventario[]) {
    this.datosTabla = new MatTableDataSource(inventarios);
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.sort = this.sort;
    this.datosTabla.filterPredicate = (elemento: Inventario, filtro: string) => {
      return (<Almacen>elemento.almacen).nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }

  aplicarFiltroBusqueda() {
    this.datosTabla.filter = this.busquedaElemento.trim().toLowerCase();
  }

  borrarBusqueda() {
    this.busquedaElemento = '';
    this.aplicarFiltroBusqueda();
  }

  verExistencias(inventario: Inventario) {
    this.dialog.open(InventariosInvFisicoHistorialExistenciasModalComponent, {
      data: inventario
    });
  }
}
