import { Component, OnInit } from '@angular/core';
import { Sucursal } from 'src/app/comun/modelos/sucursal.model';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { Estado } from 'src/app/comun/modelos/estado.model';
import { ToastrService } from 'ngx-toastr';
import { Municipio } from 'src/app/comun/modelos/municipio.model';
import { RootService } from '../../root.service';
import { NgForm } from '@angular/forms';

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
    private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerEstados();
  }
  obtenerEstados() {
    this.cargando = true;
    this.estadosService.obtenerEstados().subscribe(
      (estados: Estado[]) => {
        this.cargando = false;
        this.estados = estados;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
      (err: any) => {
        this.cargando2 = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )
  }
  agregarSucursal(formulario: NgForm) {
    this.cargando = true;
    this.rootService.agregarSucursal(this.sucursal).subscribe(
      (agregada: Sucursal) => {
        this.cargando = false;
        this.toastr.success('Se agrego correctamente la sucursal', 'Sucursal agregada', { closeButton: true });
        formulario.resetForm();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );

  }

}
