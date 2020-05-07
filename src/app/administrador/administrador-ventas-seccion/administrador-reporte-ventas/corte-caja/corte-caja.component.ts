import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import * as momento from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CorteCaja } from 'src/app/comun/modelos/corte_caja.model';
import { MatDialog } from '@angular/material/dialog';
import { EditarCantidadComponent } from './editar-cantidad/editar-cantidad.component';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { CajaService } from 'src/app/comun/servicios/caja.service';
import { Caja } from 'src/app/comun/modelos/caja.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatStepper } from '@angular/material';


export interface Cantidades {
  efectivo: number;
  tarjetas: number;
}
@Component({
  selector: 'app-corte-caja',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.scss']
})
export class CorteCajaComponent implements OnInit {

  fecha: Date = new Date(Date.now());
  corte: CorteCaja = new CorteCaja();
  step = 0;
  caja: Caja;
  tabla: any[];
  displayedColumns: string[] = ['metodopago', 'esperado', 'ok', 'editar', 'contado'];
  editar: boolean[] = [];
  cantidadOk: boolean = false;
  totalContado: number = 0;
  efectivoADejar: number = 0;
  tarjetaADejar: number = 0;
  cargandoCorte: boolean = false;
  corteRealizado: boolean = false;
  cajas: Caja[] = [];
  constructor(public authService: ServicioAutenticacionService,
    private adminService: AdministradorService,
    private toastr: NgToastrService,
    public dialog: MatDialog,
    private cajasService: CajaService) {

  }

  ngOnInit() {
    this.obtenerCajasSucursal();
  }
  obtenerCajasSucursal() {
    this.cargandoCorte = true;
    this.cajasService.obtenerCajas().subscribe(
      (cajas: Caja[]) => {
        this.cargandoCorte = false;
        this.cajas = cajas;
        console.log(this.cajas);
      },
      (err: HttpErrorResponse) => {
        this.cargandoCorte = false;
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  inicializarCaja() {
    this.inicializarTablaCantidades(<Caja>this.corte.caja);
    this.inicializarBotonesEditar();
    this.sumarTotal();

  }
  obtenerTotalCaja() {
    this.adminService.obtenerTotalCaja().subscribe(
      (caja) => {
        this.caja = caja;
        this.inicializarTablaCantidades(caja);
        this.inicializarBotonesEditar();
        this.sumarTotal();
      },
      (err) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }

  existeCorte(idCaja: string) {
    this.corteRealizado = false;
    this.cargandoCorte = true;
    this.cajasService.existeCorteCaja(idCaja).subscribe(
      (resp: any) => {
        this.cargandoCorte = false;
        if (resp.encontrado) {
          this.corteRealizado = true;
        }
      },
      (err: HttpErrorResponse) => {
        this.cargandoCorte = false;
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  cantidadCorrecta(indice) {
    this.tabla[indice].contado = this.tabla[indice].esperado;
    this.editar[indice] = false;
    this.sumarTotal();
  }
  seleccionarCantidadADejar(tipo) {
    const dialogRef = this.dialog.open(EditarCantidadComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined || result != null) {
        switch (tipo) {
          case 0:
            if (result > this.tabla[0].contado) {
              this.toastr.abrirToastr('advertencia', 'No puedes dejar mas efectivo del contado, ingresa otra cantidad', '')
            } else {
              this.efectivoADejar = result;
            }
            break;
          case 1:
            if (result > this.tabla[1].contado) {
              this.toastr.abrirToastr('advertencia', 'No puedes dejar mas efectivo del contado, ingresa otra cantidad', '')
            } else {
              this.tarjetaADejar = result;
            }
        }
      }
    });
  }
  hacerCorte(cajaForm: NgForm, contarCajaForm: NgForm, cantidadMantenerForm: NgForm) {
    this.actualizarCaja();
    this.crearCorteCaja(cajaForm, contarCajaForm, cantidadMantenerForm);
    this.corteRealizado = true;

  }
  actualizarCaja() {
    this.corte.caja.cantidadTotal = this.efectivoADejar + this.tarjetaADejar;
    this.corte.caja.cantidadEfectivo = this.efectivoADejar;
    this.corte.caja.cantidadTarjetas = this.tarjetaADejar;
    this.cargandoCorte = true;
    this.cajasService.actualizarCantidadesCaja(this.corte.caja).subscribe(
      (cajaActualizada: Caja) => {
        this.cargandoCorte = false;
        this.toastr.abrirToastr('exito', 'Caja actualizada correctamente', 'Exito')
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
        this.cargandoCorte = false;
      }
    );
  }
  crearCorteCaja(cajaForm: NgForm, contarCajaForm: NgForm, cantidadMantenerForm: NgForm) {
    this.corte.efectivoEsperado = this.tabla[0].esperado;
    this.corte.tarjetaEsperado = this.tabla[1].esperado;
    this.corte.efectivoContado = this.tabla[0].contado;
    this.corte.tarjetaContado = this.tabla[1].contado;
    this.corte.fondoEfectivo = this.efectivoADejar;
    this.corte.fondoTarjetas = this.tarjetaADejar;
    this.cargandoCorte = true;
    this.cajasService.crearCorteCaja(this.corte).subscribe(
      (creado: CorteCaja) => {
        this.toastr.abrirToastr('exito', 'Exito', 'Corte creado exitosamente');
        this.cargandoCorte = false;
        this.tabla = null;
        this.corteRealizado = false;
        cajaForm.resetForm();
        contarCajaForm.resetForm();
        cantidadMantenerForm.resetForm();

      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.cargandoCorte = false;
      }
    );
  }
  editarCantidad(indice) {
    const dialogRef = this.dialog.open(EditarCantidadComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined || result != null) {
        this.tabla[indice].contado = result;
        this.editar[indice] = false;
        this.sumarTotal();
      }
    });
  }
  sumarTotal() {
    this.totalContado = 0;
    let contado = 0;
    for (let i = 0; i < this.tabla.length; i++) {
      contado = contado + this.tabla[i].contado;
    }
    this.totalContado = contado - this.corte.caja.cantidadTotal;
  }
  inicializarBotonesEditar() {
    for (let i = 0; i < this.tabla.length; i++) {
      this.editar[i] = true;
    }
  }
  inicializarTablaCantidades(caja: Caja) {
    this.tabla = [
      {
        metodo: 'Efectivo',
        esperado: caja.cantidadEfectivo,
        contado: 0
      },
      {
        metodo: 'Tarjeta',
        esperado: caja.cantidadTarjetas,
        contado: 0
      }
    ]
  }
  menorIgualCero() {
    if (this.totalContado < 0) {
      return 0;
    } else if (this.totalContado == 0) {
      return 1;
    } else {
      return 2;
    }
  }
}
