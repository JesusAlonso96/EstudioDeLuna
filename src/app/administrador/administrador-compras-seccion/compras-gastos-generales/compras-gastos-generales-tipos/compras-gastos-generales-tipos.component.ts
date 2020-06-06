import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { TipoGastoGeneral } from 'src/app/comun/modelos/tipo_gasto_general.model';
import { TipoGastoGeneralService } from 'src/app/comun/servicios/tipo-gasto-general.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { AltaTipoGastoGeneralComponent } from 'src/app/comun/componentes/modales/alta-tipo-gasto-general/alta-tipo-gasto-general.component';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-compras-gastos-generales-tipos',
  templateUrl: './compras-gastos-generales-tipos.component.html',
  styleUrls: ['./compras-gastos-generales-tipos.component.scss']
})
export class ComprasGastosGeneralesTiposComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['id', 'nombre', 'rfcEmisor', 'razonSocial', 'editar', 'eliminar'];
  tiposGastoGeneral: TipoGastoGeneral[];
  cargando: boolean = false;
  
  constructor(private tipoGastoGeneralService: TipoGastoGeneralService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService,
    private dialog: MatDialog) { }

  ngOnInit() {
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

  nuevoTipoGastoGeneral() {
    const dialogRef = this.dialog.open(AltaTipoGastoGeneralComponent, {
      width: '50%'
    });
    dialogRef.afterClosed().subscribe(tipoGastoGeneral => {
      if (tipoGastoGeneral) {
        this.agregarTipoGastoGeneral(tipoGastoGeneral);
      }
    })
  }

  agregarTipoGastoGeneral(tipoGastoGeneral: TipoGastoGeneral) {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Agregando tipo de gasto general');
    tipoGastoGeneral.rfc = tipoGastoGeneral.rfc.toUpperCase();
    this.tipoGastoGeneralService.nuevoTipoGastoGeneral(tipoGastoGeneral).subscribe(
      (tipoGastoGeneral: TipoGastoGeneral) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito',`Se ha agregado exitosamente el tipo de gasto general ${tipoGastoGeneral.id}`, 'Tipo de gasto general agregado exitosamente');
        this.tiposGastoGeneral.push(tipoGastoGeneral);
        this.buscador.datosTabla.data = this.tiposGastoGeneral;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }
}
