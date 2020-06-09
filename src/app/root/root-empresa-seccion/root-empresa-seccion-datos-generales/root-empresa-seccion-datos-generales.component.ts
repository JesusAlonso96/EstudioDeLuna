import { Component, OnInit } from '@angular/core';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { EmpresaService } from 'src/app/comun/servicios/empresa.service';
import { DatosEmpresa } from 'src/app/comun/modelos/datos_empresa.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root-empresa-seccion-datos-generales',
  templateUrl: './root-empresa-seccion-datos-generales.component.html',
  styleUrls: ['./root-empresa-seccion-datos-generales.component.scss']
})
export class RootEmpresaSeccionDatosGeneralesComponent implements OnInit {
  empresa: DatosEmpresa = new DatosEmpresa();
  constructor(
    private cargandoService: CargandoService,
    private toastr: NgToastrService,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.obtenerDatosGeneralesEmpresa();
  }
  obtenerDatosGeneralesEmpresa() {
    this.cargandoService.crearVistaCargando(true);
    this.empresaService.obtenerDatosGeneralesEmpresa().subscribe(
      (empresa: DatosEmpresa) => {
        this.cargandoService.crearVistaCargando(false);
        this.empresa = empresa;
        console.log(empresa);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    )
  }

}
