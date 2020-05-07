import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TraspasoService } from 'src/app/comun/servicios/traspaso.service';
import { Traspaso } from 'src/app/comun/modelos/traspaso.model';
import { Movimiento, Almacen } from 'src/app/comun/modelos/almacen.model';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';

@Component({
  selector: 'app-inventarios-almacenes-traspasos-pendientes',
  templateUrl: './inventarios-almacenes-traspasos-pendientes.component.html',
  styleUrls: ['./inventarios-almacenes-traspasos-pendientes.component.scss']
})
export class InventariosAlmacenesTraspasosPendientesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  datosTabla: MatTableDataSource<Traspaso>;
  columnas: string[] = ['id', 'sucursalOrigen', 'almacenOrigen', 'sucursalDestino', 'almacenDestino', 'insumo', 'cantidad', 'recibir', 'eliminar'];
  cargando: boolean = false;
  idSucursal: string;

  constructor(
    private almacenService: AlmacenService,
    private traspasoService: TraspasoService,
    private servicioAutenticacionService: ServicioAutenticacionService,
    private toastr: NgToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.idSucursal = this.servicioAutenticacionService.getIdSucursal();
    this.obtenerTraspasosPendientes();
  }

  obtenerTraspasosPendientes() {
    this.cargando = true;
    this.traspasoService.obtenerTraspasosPendientes().subscribe(
      (traspasos: Traspaso[]) => {
        console.log(traspasos);
        this.inicializarTabla(traspasos);
        this.cargando = false;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  inicializarTabla(traspasos: Traspaso[]) {
    this.datosTabla = new MatTableDataSource(traspasos);
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.sort = this.sort;
    this.datosTabla.filterPredicate = (elemento: Traspaso, filtro: string) => {
      return elemento.almacenDestino.nombre.trim().toLowerCase().indexOf(filtro) !== -1
        || elemento.almacenOrigen.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }

  aplicarFiltroBusqueda() {
    this.datosTabla.filter = this.busquedaElemento.trim().toLowerCase();
  }

  borrarBusqueda() {
    this.busquedaElemento = '';
    this.aplicarFiltroBusqueda();
  }

  recibirTraspaso(traspaso: Traspaso) {
    this.cargando = true;
    this.traspasoService.actualizarEstadoTraspaso(traspaso._id, 'Recibido').subscribe(
      (mensaje: Mensaje) => {
        this.toastr.abrirToastr('exito',mensaje.titulo, mensaje.detalles);
        let posicionTraspaso = this.datosTabla.data.findIndex((traspasoBusqueda: Traspaso) => {
          return traspasoBusqueda._id == traspaso._id;
        });
        let traspasosActualizados: Traspaso[] = this.datosTabla.data;
        if (posicionTraspaso != -1) {
          traspasosActualizados.splice(posicionTraspaso, 1);
        }
        this.inicializarTabla(traspasosActualizados);
        this.actualizarInsumoAlmacen(traspaso.almacenDestino._id, traspaso, 'Recepcion traspaso');
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }

  eliminarTraspaso(traspaso: Traspaso){
    this.cargando = true;
    this.traspasoService.eliminarTraspaso(traspaso._id).subscribe(
      (mensaje: Mensaje) => {
        //this.toastr.abrirToastr('exito', mensaje.titulo, mensaje.detalles);
        let posicionTraspaso = this.datosTabla.data.findIndex((traspasoBusqueda: Traspaso) => {
          return traspasoBusqueda._id == traspaso._id;
        });
        let traspasosActualizados: Traspaso[] = this.datosTabla.data;
        if (posicionTraspaso != -1) {
          traspasosActualizados.splice(posicionTraspaso, 1);
        }
        this.inicializarTabla(traspasosActualizados);
        this.actualizarInsumoAlmacen(traspaso.almacenOrigen._id, traspaso, 'Traspaso eliminado');
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }

  actualizarInsumoAlmacen(idAlmacen: string, traspaso: Traspaso, tipo: string){
    this.almacenService.actualizarInsumoAlmacen(idAlmacen, traspaso.insumo._id, this.obtenerDatosMovimiento(traspaso, tipo)).subscribe(
      (almacen: Almacen) => {
        this.cargando = false;
        this.toastr.abrirToastr('exito','Traspaso recibido exitosamente', `Se ha realizado el incremento exitosamente al almacen ${traspaso.almacenDestino.nombre} del insumo ${traspaso.insumo.nombre}`);
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerDatosMovimiento(traspaso: Traspaso, tipo: string): Movimiento {
    let movimiento = new Movimiento();
    movimiento.cantidadMovimiento = traspaso.cantidadMovimiento;
    movimiento.insumo = traspaso.insumo;
    movimiento.observaciones = traspaso.observaciones;
    movimiento.traspaso = traspaso._id;
    movimiento.tipo = tipo;
    return movimiento;
  }
}
