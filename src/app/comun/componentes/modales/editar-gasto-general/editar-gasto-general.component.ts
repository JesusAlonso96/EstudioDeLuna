import { Component, OnInit, Inject } from '@angular/core';
import { TiposDePersona } from 'src/app/comun/enumeraciones/tipos-de-persona.enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GastoGeneral } from 'src/app/comun/modelos/gasto_general.model';
import { MetodosPago } from 'src/app/comun/enumeraciones/metodos-pago.enum';
import { isNumber } from 'util';

@Component({
  selector: 'app-editar-gasto-general',
  templateUrl: './editar-gasto-general.component.html',
  styleUrls: ['./editar-gasto-general.component.scss']
})
export class EditarGastoGeneralComponent implements OnInit {
  cargando: boolean = false;
  TiposDePersona = TiposDePersona;
  MetodosPago = MetodosPago;
  
  constructor(public dialogRef: MatDialogRef<EditarGastoGeneralComponent>,
    @Inject(MAT_DIALOG_DATA) public gastoGeneral: GastoGeneral) {
      this.inicializarCantidades();
    }

  ngOnInit() {}

  onNoClick() {
    this.dialogRef.close();
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
    if(isNumber(this.gastoGeneral.subtotal)) {
      this.gastoGeneral.iva = ((this.gastoGeneral.subtotal * this.gastoGeneral.porcentajeIva) / 100).toFixed(2);
    } else {
      this.gastoGeneral.iva = '0.00';
    }
  }

  inicializarTotal(){
    this.gastoGeneral.total = 0;
    this.gastoGeneral.total += (isNumber(this.gastoGeneral.subtotal) ? this.gastoGeneral.subtotal : 0);
    this.gastoGeneral.total += (isNumber(this.gastoGeneral.subtotal) ? ((this.gastoGeneral.subtotal * this.gastoGeneral.porcentajeIva) / 100) : 0);
    this.gastoGeneral.total += (isNumber(this.gastoGeneral.ieps) ? this.gastoGeneral.ieps : 0);
    this.gastoGeneral.total = (this.gastoGeneral.total).toFixed(2);
  }
}
