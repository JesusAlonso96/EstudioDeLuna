import { Component, OnInit } from '@angular/core';
import { GastoGeneral } from 'src/app/comun/modelos/gasto_general.model';
import { TiposDePersona } from 'server/enumeraciones/tipos_de_persona';
import { MatDialogRef } from '@angular/material';
import { TipoGastoGeneralService } from 'src/app/comun/servicios/tipo-gasto-general.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { TipoGastoGeneral } from 'src/app/comun/modelos/tipo_gasto_general.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MetodosPago } from 'src/app/comun/enumeraciones/metodos-pago.enum';
import { isNumber } from 'util';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-alta-gasto-general',
  templateUrl: './alta-gasto-general.component.html',
  styleUrls: ['./alta-gasto-general.component.scss']
})
export class AltaGastoGeneralComponent implements OnInit {
  nuevoGastoGeneral: GastoGeneral = new GastoGeneral();
  tiposGastoGeneral: TipoGastoGeneral[] = [];
  cargando: boolean = false;
  TiposDePersona = TiposDePersona;
  MetodosPago = MetodosPago;
  
  constructor(public dialogRef: MatDialogRef<AltaGastoGeneralComponent>,
    private tipoGastoGeneralService: TipoGastoGeneralService,
    private cargandoService: CargandoService,
    private toastr: NgToastrService) { }

  ngOnInit() {
    this.inicializarCantidades();
    this.obtenerTiposGastoGeneral();
  }

  obtenerTiposGastoGeneral() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo tipos de gasto');
    this.tipoGastoGeneralService.obtenerTiposGastoGeneral().subscribe(
      (tiposGastoGeneral: TipoGastoGeneral[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.tiposGastoGeneral = tiposGastoGeneral;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  onNoClick() {
    this.dialogRef.close();
  }

  obtenerRazonSocial(tipoGastoGeneral: TipoGastoGeneral): string {
    switch (tipoGastoGeneral.tipoDePersona) {
      case TiposDePersona.Moral: return tipoGastoGeneral.razonSocial;
      case TiposDePersona.Fisica: return tipoGastoGeneral.nombre_persona + ' ' + tipoGastoGeneral.ape_pat_persona + (tipoGastoGeneral.ape_mat_persona ? (' ' + tipoGastoGeneral.ape_mat_persona) : '');
    }
  }

  inicializarDatosTipoGastoGeneral() {
    this.nuevoGastoGeneral.nombre = this.nuevoGastoGeneral.tipoGastoGeneral.nombre;
    this.nuevoGastoGeneral.razonSocial = this.obtenerRazonSocial(this.nuevoGastoGeneral.tipoGastoGeneral);
    this.nuevoGastoGeneral.rfc = this.nuevoGastoGeneral.tipoGastoGeneral.rfc;
  }

  obtenerMetodoPago(metodoPago: string): string {
    switch (metodoPago) {
      case MetodosPago.Efectivo: return 'Efectivo';
      case MetodosPago.TransferenciaElectronicaDeFondos: return 'Transferencia electrónica de fondos';
    }
  }

  inicializarCantidades(){
    this.inicializarIVA();
    this.inicializarTotal();
  }

  inicializarIVA(){
    if(isNumber(this.nuevoGastoGeneral.subtotal)) {
      this.nuevoGastoGeneral.iva = ((this.nuevoGastoGeneral.subtotal * this.nuevoGastoGeneral.porcentajeIva) / 100).toFixed(2);
    } else {
      this.nuevoGastoGeneral.iva = '0.00';
    }
  }

  inicializarTotal(){
    this.nuevoGastoGeneral.total = 0;
    this.nuevoGastoGeneral.total += (isNumber(this.nuevoGastoGeneral.subtotal) ? this.nuevoGastoGeneral.subtotal : 0);
    this.nuevoGastoGeneral.total += (isNumber(this.nuevoGastoGeneral.subtotal) ? ((this.nuevoGastoGeneral.subtotal * this.nuevoGastoGeneral.porcentajeIva) / 100) : 0);
    this.nuevoGastoGeneral.total += (isNumber(this.nuevoGastoGeneral.ieps) ? this.nuevoGastoGeneral.ieps : 0);
    this.nuevoGastoGeneral.total = (this.nuevoGastoGeneral.total).toFixed(2);
  }
}
