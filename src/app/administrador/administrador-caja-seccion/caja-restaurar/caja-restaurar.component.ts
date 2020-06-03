import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Caja } from 'src/app/comun/modelos/caja.model';
import { CajaService } from 'src/app/comun/servicios/caja.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-caja-restaurar',
  templateUrl: './caja-restaurar.component.html',
  styleUrls: ['./caja-restaurar.component.scss']
})
export class CajaRestaurarComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['num_caja', 'activa', 'sucursal', 'opciones'];
  cajas: Caja[];

  constructor(
    private cajaService: CajaService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerCajasEliminadas();
  }
  obtenerCajasEliminadas() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo cajas eliminadas...')
    this.cajaService.obtenerCajasEliminadas().subscribe(
      (cajas: Caja[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.cajas = cajas;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
}
