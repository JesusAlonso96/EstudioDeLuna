import { Component, OnInit, Inject } from '@angular/core';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Movimiento } from 'src/app/comun/modelos/almacen.model';
import { Inventario } from 'src/app/comun/modelos/inventario.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventarios-entradas-salidas-detalles-modal',
  templateUrl: './inventarios-entradas-salidas-detalles-modal.component.html',
  styleUrls: ['./inventarios-entradas-salidas-detalles-modal.component.scss']
})
export class InventariosEntradasSalidasDetallesModalComponent implements OnInit {
  cargando: boolean;
  movimiento: Movimiento;

  constructor(
    private almacenService: AlmacenService,
    private toastr: NgToastrService,
    public dialogRef: MatDialogRef<InventariosEntradasSalidasDetallesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movimiento) { 
    }

  ngOnInit(): void {
    this.obtenerMovimientoAlmacen();
  }
  
  obtenerMovimientoAlmacen() {
    this.cargando = true;
    this.almacenService.obtenerMovimientoAlmacenPorId(this.data.almacen._id, this.data._id).subscribe(
      (movimiento: Movimiento) => {
        this.movimiento = movimiento;
        console.log(movimiento);
        this.cargando = false;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }

  esAlta(tipoMovimiento: string) {
    switch (tipoMovimiento) {
      case 'Baja':
      case 'Baja inventario':
      case 'Envio traspaso': return false;
      case 'Traspaso eliminado':
      case 'Alta inventario':
      case 'Recepcion traspaso': return true;
    }
  }
}
