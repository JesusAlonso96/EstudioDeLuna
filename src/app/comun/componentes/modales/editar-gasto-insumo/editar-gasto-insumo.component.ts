import { Component, OnInit, Inject } from '@angular/core';
import { MetodosPago } from 'src/app/comun/enumeraciones/metodos-pago.enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GastoInsumo } from 'src/app/comun/modelos/gasto_insumo.model';

@Component({
  selector: 'app-editar-gasto-insumo',
  templateUrl: './editar-gasto-insumo.component.html',
  styleUrls: ['./editar-gasto-insumo.component.scss']
})
export class EditarGastoInsumoComponent implements OnInit {
  MetodosPago = MetodosPago;
  
  constructor(public dialogRef: MatDialogRef<EditarGastoInsumoComponent>,
    @Inject(MAT_DIALOG_DATA) public gastoInsumo: GastoInsumo) {
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
}
