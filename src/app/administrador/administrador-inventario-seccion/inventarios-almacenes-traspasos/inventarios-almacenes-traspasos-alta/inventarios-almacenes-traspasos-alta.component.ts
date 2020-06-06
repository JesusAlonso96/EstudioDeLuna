import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator } from '@angular/material';
import { Almacen, InsumoAlmacen, Movimiento } from 'src/app/comun/modelos/almacen.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SucursalService } from 'src/app/comun/servicios/sucursal.service';
import { Sucursal } from 'src/app/comun/modelos/sucursal.model';
import { TraspasoService } from 'src/app/comun/servicios/traspaso.service';
import { Traspaso } from 'src/app/comun/modelos/traspaso.model';
import { FormGroup } from '@angular/forms';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-inventarios-almacenes-traspasos-alta',
  templateUrl: './inventarios-almacenes-traspasos-alta.component.html',
  styleUrls: ['./inventarios-almacenes-traspasos-alta.component.scss']
})
export class InventariosAlmacenesTraspasosAltaComponent implements OnInit {
  @ViewChild('traspasoInsumoForm') traspasoInsumoForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  traspaso: Traspaso = new Traspaso();
  sucursales: Sucursal[] = [];
  sucursalDestino: Sucursal;
  almacenesOrigen: Almacen[] = [];
  almacenesDestino: Almacen[] = [];
  insumosAlmacen: InsumoAlmacen[] = [];
  insumosAlmacenFiltrados: InsumoAlmacen[] = [];
  cargando: boolean = false;
  observaciones: string = '';
  existenciaActual: number;

  constructor(
    private almacenService: AlmacenService,
    private sucursalService: SucursalService,
    private traspasoService: TraspasoService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService
  ) { }

  ngOnInit() {
    this.traspaso.estado = 'Enviado';
    this.obtenerAlmacenes();
    this.obtenerSucursales();
  }

  obtenerAlmacenes() {
    this.cargando = this.cargandoService.crearVistaCargando(true, 'Obteniendo almacenes')
    this.almacenService.obtenerAlmacenes().subscribe(
      (almacenes: Almacen[]) => {
        this.almacenesOrigen = almacenes;
        this.cargando = this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerSucursales() {
    this.cargando = this.cargandoService.crearVistaCargando(true, 'Obteniendo sucursales');
    this.sucursalService.obtenerSucursales().subscribe(
      (sucursales: Sucursal[]) => {
        this.sucursales = sucursales;
        this.cargando = this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerAlmacenesSucursal() {
    if (this.sucursalDestino != null) {
      this.cargando = this.cargandoService.crearVistaCargando(true, 'Obteniendo almacenes de sucursal');
      this.traspaso.almacenDestino = null;
      this.almacenesDestino = [];
      this.sucursalService.obtenerAlmacenesSucursal(this.sucursalDestino._id).subscribe(
        (almacenes: Almacen[]) => {
          this.almacenesDestino = almacenes;
          this.cargando = this.cargandoService.crearVistaCargando(false);
        },
        (err: HttpErrorResponse) => {
          this.cargando = this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
        }
      )
    }
  }

  obtenerAlmacen() {
    if (this.traspaso.almacenOrigen != null) {
      this.cargando = this.cargandoService.crearVistaCargando(true, 'Obteniendo almacen');
      this.insumosAlmacen = this.insumosAlmacenFiltrados = [];
      this.traspaso.insumo = null;
      this.traspaso.observaciones = '';
      this.almacenService.obtenerAlmacenPorId(this.traspaso.almacenOrigen._id).subscribe(
        (almacen: Almacen) => {
          this.insumosAlmacen = this.insumosAlmacenFiltrados = almacen.insumos;
          this.cargando = this.cargandoService.crearVistaCargando(false);
        },
        (err: HttpErrorResponse) => {
          this.cargando = this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
        }
      )
    }
  }

  borrarBusqueda() {
    this.busquedaElemento = '';
    this.aplicarFiltroBusqueda();
  }

  aplicarFiltroBusqueda() {
    this.insumosAlmacenFiltrados = this.insumosAlmacen.filter(insumoAlmacen => {
      return insumoAlmacen.insumo.nombre.trim().toLowerCase().indexOf(this.busquedaElemento) !== -1;
    });
    if (this.traspaso.insumo != null) {
      let posicionInsumoAlmacen = this.insumosAlmacenFiltrados.findIndex(insumoAlmacenFiltrado => {
        return insumoAlmacenFiltrado.insumo._id == this.traspaso.insumo._id;
      });
      if (posicionInsumoAlmacen == -1) {
        this.traspaso.insumo = null;
      }
    }
  }

  inicializarDatosInsumo() {
    let posicionInsumoAlmacen = this.insumosAlmacenFiltrados.findIndex(insumoAlmacenFiltrado => {
      return insumoAlmacenFiltrado.insumo._id == this.traspaso.insumo._id;
    });
    if (posicionInsumoAlmacen != -1) {
      this.existenciaActual = this.insumosAlmacenFiltrados[posicionInsumoAlmacen].existencia;
      this.traspaso.cantidadMovimiento = 1;
      this.traspaso.observaciones = '';
    }
  }

  aumentarTraspaso() {
    if (this.existenciaActual > this.traspaso.cantidadMovimiento) {
      this.traspaso.cantidadMovimiento++;
    } else {
      this.toastr.abrirToastr('error', 'No es posible aumentar la cantidad del traspaso', 'Cantidad del traspaso igual a la existencia de ' + this.traspaso.insumo.nombre);
    }
  }

  disminuirTraspaso() {
    if (this.traspaso.cantidadMovimiento > 1) {
      this.traspaso.cantidadMovimiento--;
    } else {
      this.toastr.abrirToastr('error', 'No es posible disminuir la cantidad del traspaso', 'Cantidad del traspaso en ' + this.traspaso.insumo.nombre + ' en 1');
    }
  }

  nuevoTraspaso() {
    this.cargando = this.cargandoService.crearVistaCargando(true, 'Realizando traspaso');
    this.traspasoService.nuevoTraspaso(this.traspaso).subscribe(
      (traspaso: Traspaso) => {
        this.actualizarInsumoAlmacen(traspaso);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  actualizarInsumoAlmacen(traspaso: Traspaso) {
    this.almacenService.actualizarInsumoAlmacen(this.traspaso.almacenOrigen._id, this.traspaso.insumo._id, this.obtenerDatosMovimiento(traspaso)).subscribe(
      (almacen: Almacen) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', 'Traspaso realizado exitosamente', `Se ha realizado la baja exitosamente del almacen ${this.traspaso.almacenOrigen.nombre} al insumo ${this.traspaso.insumo.nombre}`);
        this.resetearFormulario();
      }, (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerDatosMovimiento(traspaso: Traspaso): Movimiento {
    let movimiento = new Movimiento();
    movimiento.cantidadMovimiento = this.traspaso.cantidadMovimiento;
    movimiento.insumo = this.traspaso.insumo;
    movimiento.observaciones = this.traspaso.observaciones;
    movimiento.traspaso = traspaso._id;
    movimiento.tipo = 'Envio traspaso';
    return movimiento;
  }

  resetearFormulario() {
    this.traspaso = new Traspaso();
    this.traspaso.estado = 'Enviado';
    this.existenciaActual = null;
    this.sucursalDestino = null;
    this.insumosAlmacen = this.insumosAlmacenFiltrados = this.almacenesDestino = [];
    this.traspasoInsumoForm.reset()
  }
}
