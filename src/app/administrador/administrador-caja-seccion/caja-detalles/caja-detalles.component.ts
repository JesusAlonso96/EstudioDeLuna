import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { Caja } from 'src/app/comun/modelos/caja.model';
import { CajaService } from 'src/app/comun/servicios/caja.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-caja-detalles',
  templateUrl: './caja-detalles.component.html',
  styleUrls: ['./caja-detalles.component.scss'],
})
export class CajaDetallesComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  @Output() cargandoEvento = new EventEmitter(true);
  columnas: string[] = ['num_caja', 'activa', 'sucursal', 'opciones'];
  cajas: Caja[];
  constructor(private cajaService: CajaService,
    private toastr: NgToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerCajas();
  }
  obtenerCajas() {
    this.crearVistaCargando(true, 'Obteniendo cajas activas...')
    this.cajaService.obtenerCajas().subscribe(
      (cajas: Caja[]) => {
        this.crearVistaCargando(false);
        this.cajas = cajas;
      },
      (err: HttpErrorResponse) => {
        this.crearVistaCargando(false);
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
        this.crearVistaCargando(true, 'Agregando caja...')
        this.cajaService.agregarCaja(new Caja()).subscribe(
          (caja: Caja) => {
            this.cajas.push(caja);
            this.buscador.datosTabla.data = this.cajas;
            this.crearVistaCargando(false);
            this.toastr.abrirToastr('exito', 'Caja agregada', 'Se ha agregado una nueva caja con exito');
          },
          (err: HttpErrorResponse) => {
            this.crearVistaCargando(false);
            this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
          }
        );
      }
    })
  }
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
}
