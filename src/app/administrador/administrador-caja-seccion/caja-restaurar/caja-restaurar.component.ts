import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Caja } from 'src/app/comun/modelos/caja.model';
import { CajaService } from 'src/app/comun/servicios/caja.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-caja-restaurar',
  templateUrl: './caja-restaurar.component.html',
  styleUrls: ['./caja-restaurar.component.scss']
})
export class CajaRestaurarComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  @Output() cargandoEvento = new EventEmitter(true);
  columnas: string[] = ['num_caja', 'activa', 'sucursal', 'opciones'];
  cajas: Caja[];

  constructor(private cajaService: CajaService,
    private toastr: NgToastrService) { }

  ngOnInit() {
    this.obtenerCajasEliminadas();
  }
  obtenerCajasEliminadas() {
    this.crearVistaCargando(true, 'Obteniendo cajas eliminadas...')
    this.cajaService.obtenerCajasEliminadas().subscribe(
      (cajas: Caja[]) => {
        this.crearVistaCargando(false);
        this.cajas = cajas;
      },
      (err: HttpErrorResponse) => {
        this.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
}
