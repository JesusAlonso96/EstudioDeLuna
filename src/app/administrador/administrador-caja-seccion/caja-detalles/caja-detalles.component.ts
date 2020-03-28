import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { Caja } from 'src/app/comun/modelos/caja.model';
import { CajaService } from 'src/app/comun/servicios/caja.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-caja-detalles',
  templateUrl: './caja-detalles.component.html',
  styleUrls: ['./caja-detalles.component.scss']
})
export class CajaDetallesComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['num_caja', 'activa', 'sucursal','eliminar'];
  cajas: Caja[];
  cargando: boolean = false;

  constructor(private cajaService: CajaService,
    private toastr: NgToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerCajas();
  }
  obtenerCajas() {
    this.cargando = true;
    this.cajaService.obtenerCajas().subscribe(
      (cajas: Caja[]) => {
        this.cargando = false
        this.cajas = cajas;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  nuevaCaja() {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: {
        titulo: 'Agregar caja',
        mensaje: '¿Desea agregar una nueva caja?',
        msgBoton: 'Agregar',
        color: 'primary'
      }
    })
    dialogRef.afterClosed().subscribe(agregar => {
      if (agregar) {
        this.cargando = true;
        this.cajaService.agregarCaja(new Caja()).subscribe(
          (caja: Caja) => {
            this.cajas.push(caja);
            this.buscador.datosTabla.data = this.cajas;
            this.cargando = false;
            this.toastr.abrirToastr('exito', 'Caja agregada', 'Se ha agregado una nueva caja con exito');
          },
          (err: HttpErrorResponse) => {
            this.cargando = false;
            this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
          }
        );
      }
    })
  }

}
