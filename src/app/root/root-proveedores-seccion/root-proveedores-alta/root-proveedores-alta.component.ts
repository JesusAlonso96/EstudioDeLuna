import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Estado } from 'src/app/comun/modelos/estado.model';
import { Municipio } from 'src/app/comun/modelos/municipio.model';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';

@Component({
  selector: 'app-root-proveedores-alta',
  templateUrl: './root-proveedores-alta.component.html',
  styleUrls: ['./root-proveedores-alta.component.scss']
})
export class RootProveedoresAltaComponent implements OnInit {
  proveedor: Proveedor = new Proveedor();
  estados: Estado[];
  estado: Estado;
  municipios: Municipio[];
  municipio: Municipio;
  cargandoMunicipio: boolean = false;

  constructor(
    private estadoService: EstadosService,
    private toastr: NgToastrService,
    private proveedoresService: ProveedoresService,
    private cargandoService: CargandoService) { }

  ngOnInit(): void {
    this.obtenerEstados();
  }

  obtenerEstados() {
    this.estadoService.obtenerEstados().subscribe(
      (estados: Estado[]) => {
        this.estados = estados;
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  buscarMunicipios(estado: Estado) {
    this.proveedor.estado = estado.nombre;
    this.cargandoMunicipio = true;
    this.estadoService.obtenerMunicipios(estado._id).subscribe(
      (municipios: Municipio[]) => {
        this.cargandoMunicipio = false;
        this.municipios = municipios;
      },
      (err: HttpErrorResponse) => {
        this.cargandoMunicipio = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  seleccionoEstado(): boolean {
    return this.estado ? true : false;
  }
  setMunicipio() {
    this.proveedor.ciudad = this.municipio.nombre;
  }
  registrarProveedor(formulario: NgForm) {
    this.cargandoService.crearVistaCargando(true, 'Registrando proveedor...');
    this.proveedoresService.nuevoProveedor(this.proveedor).subscribe(
      (registrado: any) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', registrado.detalles, registrado.titulo);
        formulario.resetForm();
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
}
