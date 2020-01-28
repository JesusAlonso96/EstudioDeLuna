import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { Estado } from 'src/app/comun/modelos/estado.model';
import { Municipio } from 'src/app/comun/modelos/municipio.model';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';

@Component({
  selector: 'app-proveedores-alta',
  templateUrl: './proveedores-alta.component.html',
  styleUrls: ['./proveedores-alta.component.scss']
})
export class ProveedoresAltaComponent implements OnInit {

  proveedor: Proveedor = new Proveedor();
  estados: Estado[];
  estado: Estado;
  municipios: Municipio[];
  municipio: Municipio;
  cargando: boolean = false;
  cargandoMunicipio: boolean = false;

  constructor(private estadoService: EstadosService, private toastr: ToastrService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.obtenerEstados();
  }

  obtenerEstados() {
    this.estadoService.obtenerEstados().subscribe(
      (estados: Estado[]) => {
        this.estados = estados;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
      (err) => {
        this.cargandoMunicipio = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  seleccionoEstado() {
    if (this.estado) return true;
    return false;
  }
  setMunicipio() {
    this.proveedor.ciudad = this.municipio.nombre;
  }
  registrarProveedor(formulario: NgForm) {
    this.cargando = true;
    this.usuarioService.nuevoProveedor(this.proveedor).subscribe(
      (registrado: any) => {
        this.cargando = false;
        this.toastr.success(registrado.detalles, registrado.titulo, { closeButton: true });
        formulario.resetForm();
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }


}
