import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import * as momento from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CorteCaja } from 'src/app/comun/modelos/corte_caja.model';
import { MatDialog } from '@angular/material/dialog';
import { EditarCantidadComponent } from './editar-cantidad/editar-cantidad.component';


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
  caja: any;
  tabla: any[];
  displayedColumns: string[] = ['metodopago', 'esperado', 'ok', 'editar', 'contado'];
  editar: boolean[] = [];
  cantidadOk: boolean = false;
  totalContado: number = 0;
  efectivoADejar: number = 0;
  tarjetaADejar: number = 0;
  cargandoCorte: boolean = false;
  corteRealizado: boolean = false;
  constructor(public authService: ServicioAutenticacionService,
    private adminService: AdministradorService,
    private toastr: ToastrService,
    public dialog: MatDialog) {

  }

  ngOnInit() {
    this.obtenerTotalCaja();
    this.existeCorte();
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
        this.toastr.error(err.error.detalles, err.error.titulo)
      }
    );
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  existeCorte() {
    this.adminService.existeCorte().subscribe(
      (existe) => {
        this.corteRealizado = existe.encontrado;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo);
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
              this.toastr.warning('No puedes dejar mas efectivo del contado, ingresa otra cantidad', '', { closeButton: true })
            } else {
              this.efectivoADejar = result;
            }
            break;
          case 1:
            if (result > this.tabla[1].contado) {
              this.toastr.warning('No puedes dejar mas efectivo del contado, ingresa otra cantidad', '', { closeButton: true })
            } else {
              this.tarjetaADejar = result;
            }
        }
      }
    });
  }
  hacerCorte() {
    //actualizar caja
    this.actualizarCaja();
    //hacer el historial de corte
    this.crearCorteCaja();
    this.corteRealizado = true;

  }
  actualizarCaja() {
    this.caja.cantidadTotal = this.efectivoADejar + this.tarjetaADejar;
    this.caja.cantidadEfectivo = this.efectivoADejar;
    this.caja.cantidadTarjetas = this.tarjetaADejar;
    this.cargandoCorte = true;
    this.adminService.actualizarCaja(this.caja).subscribe(
      (actualizada) => {
        this.cargandoCorte = false;
        this.toastr.success('Caja actualizada correctamente', 'Exito', { closeButton: true })
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.cargandoCorte = false;
      }
    );
  }
  crearCorteCaja() {
    //crear fecha y hora en backend
    this.corte.efectivoEsperado = this.tabla[0].esperado;
    this.corte.tarjetaEsperado = this.tabla[1].esperado;
    this.corte.efectivoContado = this.tabla[0].contado;
    this.corte.tarjetaContado = this.tabla[1].contado;
    this.corte.fondoEfectivo = this.efectivoADejar;
    this.corte.fondoTarjetas = this.tarjetaADejar;
    this.cargandoCorte = true;
    this.adminService.crearCorteCaja(this.corte).subscribe(
      (creado) => {
        this.toastr.success('Corte creado exitosamente', 'Exito', { closeButton: true });
        this.cargandoCorte = false;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
    this.totalContado = contado - this.caja.cantidadTotal;
  }
  inicializarBotonesEditar() {
    for (let i = 0; i < this.tabla.length; i++) {
      this.editar[i] = true;
    }
  }
  inicializarTablaCantidades(caja) {
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
