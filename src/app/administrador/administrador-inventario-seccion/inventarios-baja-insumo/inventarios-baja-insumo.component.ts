import { Component, OnInit, ViewChild } from '@angular/core';
import { Almacen, InsumoAlmacen, Movimiento } from 'src/app/comun/modelos/almacen.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventarios-baja-insumo',
  templateUrl: './inventarios-baja-insumo.component.html',
  styleUrls: ['./inventarios-baja-insumo.component.scss']
})
export class InventariosBajaInsumoComponent implements OnInit {
  @ViewChild('bajaInsumoForm') bajaInsumoForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  busquedaElemento: string = '';
  movimiento: Movimiento = new Movimiento();
  almacenes: Almacen[] = [];
  almacen: Almacen;
  insumosAlmacen: InsumoAlmacen[] = [];
  insumosAlmacenFiltrados: InsumoAlmacen[] = [];
  cargando: boolean = false;
  observaciones: string = '';
  existenciaActual: number;

  constructor(
    private almacenService: AlmacenService,
    private toastr: NgToastrService
  ) { }

  ngOnInit() {
    this.movimiento.tipo = 'Baja';
    this.obtenerAlmacenes();
  }

  obtenerAlmacenes() {
    this.cargando = true;
    this.almacenService.obtenerAlmacenes().subscribe(
      (almacenes: Almacen[]) => {
        this.almacenes= almacenes;
        this.cargando = false;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  obtenerAlmacen() {
    if(this.almacen != null) {
      this.cargando = true;
      this.insumosAlmacen = this.insumosAlmacenFiltrados = [];
      this.movimiento.insumo = null;
      this.movimiento.observaciones = '';
      this.almacenService.obtenerAlmacenPorId(this.almacen._id).subscribe(
        (almacen: Almacen) => {
          this.insumosAlmacen = this.insumosAlmacenFiltrados = almacen.insumos;
          this.cargando = false;
        },
        (err: HttpErrorResponse) => {
          this.cargando = false;
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
    if (this.movimiento.insumo != null) {
      let posicionInsumoAlmacen = this.insumosAlmacenFiltrados.findIndex(insumoAlmacenFiltrado => {
        return insumoAlmacenFiltrado.insumo._id == this.movimiento.insumo._id;
      });
      if (posicionInsumoAlmacen == -1) {
        this.movimiento.insumo = null;
      }
    }
  }

  inicializarDatosInsumo() {
    let posicionInsumoAlmacen = this.insumosAlmacenFiltrados.findIndex(insumoAlmacenFiltrado => {
      return insumoAlmacenFiltrado.insumo._id == this.movimiento.insumo._id;
    });
    if (posicionInsumoAlmacen != -1) {
      this.existenciaActual = this.insumosAlmacenFiltrados[posicionInsumoAlmacen].existencia;
      this.movimiento.cantidadMovimiento = 1;
      this.movimiento.observaciones = '';
    }
  }

  aumentarBaja() {
    if(this.existenciaActual > this.movimiento.cantidadMovimiento) {
      this.movimiento.cantidadMovimiento++;
    } else {
      this.toastr.abrirToastr('error', 'No es posible aumentar la cantidad a dar de baja', 'Cantidad a dar de baja igual a la existencia de ' + this.movimiento.insumo.nombre);
    }
  }

  disminuirBaja() {
    if(this.movimiento.cantidadMovimiento > 1) {
      this.movimiento.cantidadMovimiento--;
    } else {
      this.toastr.abrirToastr('error', 'No es posible disminuir la cantidad a dar de baja', 'Cantidad a dar de baja en ' + this.movimiento.insumo.nombre + ' en 1');
    }
  }

  actualizarInsumoAlmacen(){
    this.cargando = true;
    this.almacenService.actualizarInsumoAlmacen(this.almacen._id, this.movimiento.insumo._id, this.movimiento).subscribe(
      (almacen: Almacen) => {
        this.cargando = false;
        this.toastr.abrirToastr('exito','Baja realizada exitosamente', `Se ha realizado la baja exitosamente del almacen ${this.almacen.nombre} al insumo ${this.movimiento.insumo.nombre}`);
        this.resetearFormulario();
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }

  resetearFormulario() {
    this.movimiento = new Movimiento();
    this.movimiento.tipo = 'Baja';
    this.existenciaActual = null;
    this.almacen = null;
    this.insumosAlmacen = this.insumosAlmacenFiltrados = [];
    this.bajaInsumoForm.reset()
  }
}
