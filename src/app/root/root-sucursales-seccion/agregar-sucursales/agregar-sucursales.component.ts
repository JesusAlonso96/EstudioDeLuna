import { Component, OnInit } from '@angular/core';
import { Sucursal } from 'src/app/comun/modelos/sucursal.model';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { Estado } from 'src/app/comun/modelos/estado.model';
import { ToastrService } from 'ngx-toastr';
import { Municipio } from 'src/app/comun/modelos/municipio.model';
import { RootService } from '../../root.service';
import { NgForm } from '@angular/forms';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-agregar-sucursales',
  templateUrl: './agregar-sucursales.component.html',
  styleUrls: ['./agregar-sucursales.component.scss']
})
export class AgregarSucursalesComponent implements OnInit {
  cargando: boolean = false;
  cargando2: boolean = false;
  sucursal: Sucursal = new Sucursal();
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  constructor(private estadosService: EstadosService,
    private rootService: RootService,
    private cargandoService: CargandoService,
    private toastr: NgToastrService) { }

  ngOnInit() {
    this.obtenerEstados();
  }
  obtenerEstados() {
    this.cargando = true;
    this.estadosService.obtenerEstados().subscribe(
      (estados: Estado[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.estados = estados;
      },
      (err: any) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.titulo, err.error.detalles);
      }
    );
  }
  buscarMunicipios(estado: Estado) {
    this.cargando2 = true;
    this.estadosService.obtenerMunicipios(estado._id).subscribe(
      (municipios: Municipio[]) => {
        this.cargando2 = false;
        this.municipios = municipios;
      },
      (err: HttpErrorResponse) => {
        this.cargando2 = false;
        this.toastr.abrirToastr('error',err.error.titulo, err.error.detalles);
      }
    )
  }
  agregarSucursal(formulario: NgForm) {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Agregando sucursal');
    this.rootService.agregarSucursal(this.sucursal).subscribe(
      (agregada: Sucursal) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito','Se agrego correctamente la sucursal', 'Sucursal agregada');
        formulario.resetForm();
      },
      (err: any) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.error(err.error.titulo, err.error.detalles);
      }
    );

  }

}
