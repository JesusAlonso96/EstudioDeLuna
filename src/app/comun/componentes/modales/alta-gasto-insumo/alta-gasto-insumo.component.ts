import { Component, OnInit, Inject } from '@angular/core';
import { GastoInsumo } from 'src/app/comun/modelos/gasto_insumo.model';
import { Compra } from 'src/app/comun/modelos/compra.model';
import { MetodosPago } from 'src/app/comun/enumeraciones/metodos-pago.enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompraService } from 'src/app/comun/servicios/compra.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-alta-gasto-insumo',
  templateUrl: './alta-gasto-insumo.component.html',
  styleUrls: ['./alta-gasto-insumo.component.scss']
})
export class AltaGastoInsumoComponent implements OnInit {
  nuevoGastoInsumo: GastoInsumo = new GastoInsumo();
  cargando: boolean = false;

  constructor(public dialogRef: MatDialogRef<AltaGastoInsumoComponent>,
    private compraService: CompraService,
    private toastr: NgToastrService,
    @Inject(MAT_DIALOG_DATA) public compra: Compra) {
    this.nuevoGastoInsumo.compra = this.compra;
    this.inicializarDatosCompra();
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

  inicializarDatosCompra() {
    this.nuevoGastoInsumo.razonSocial = this.nuevoGastoInsumo.compra.proveedor.nombre;
    this.nuevoGastoInsumo.rfc = this.nuevoGastoInsumo.compra.proveedor.rfc;
  }
}
