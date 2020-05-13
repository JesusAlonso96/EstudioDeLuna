import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { AltaEmpresaComponent } from 'src/app/comun/componentes/modales/alta-empresa/alta-empresa.component';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { CotizacionesService } from 'src/app/comun/servicios/cotizaciones.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
  providers: []
})
export class EmpresasComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  displayedColumns: string[] = ['nombre', 'contacto', 'email', 'editar', 'eliminar'];
  empresas: EmpresaCot[];
  cargando: boolean = false;
  constructor(private dialog: MatDialog, private cotizacionesService: CotizacionesService, private toastr: NgToastrService) { }

  ngOnInit() {
    this.obtenerEmpresas();
  }
  obtenerEmpresas() {
    this.cargando = true;
    this.cotizacionesService.obtenerEmpresas().subscribe(
      (empresas: EmpresaCot[]) => {
        this.cargando = false;
        this.empresas = empresas;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  nuevaEmpresa() {
    const dialogRef = this.dialog.open(AltaEmpresaComponent);
    dialogRef.afterClosed().subscribe(empresa => {
      if (empresa) {
        this.agregarEmpresa(empresa);
      }
    })
  }
  agregarEmpresa(empresa: EmpresaCot) {
    this.cargando = true;
    this.cotizacionesService.agregarEmpresa(empresa).subscribe(
      (agregada: Mensaje) => {
        this.cargando = false;
        this.toastr.abrirToastr('exito', agregada.detalles, agregada.detalles);
        this.empresas.push(empresa);
        this.buscador.datosTabla.data = this.empresas;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
}
