import { Component, OnInit } from '@angular/core';
import { Almacen } from 'src/app/comun/modelos/almacen.model';
import { MatDialogRef } from '@angular/material';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { Estado } from 'src/app/comun/modelos/estado.model';
import { Municipio } from 'src/app/comun/modelos/municipio.model';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { Sucursal } from 'src/app/comun/modelos/sucursal.model';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-alta-almacen',
  templateUrl: './alta-almacen.component.html',
  styleUrls: ['./alta-almacen.component.scss']
})
export class AltaAlmacenComponent implements OnInit {
  nuevoAlmacen: Almacen = new Almacen();
  estados: Estado[];
  estado: Estado;
  municipios: Municipio[];
  municipio: Municipio;
  cargando: boolean = false;
  constructor(public dialogRef: MatDialogRef<AltaAlmacenComponent>,
    private usuarioService: UsuarioService,
    private estadosService: EstadosService,
    private cargandoService: CargandoService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.nuevoAlmacen.direccion.estado = '';
    this.obtenerEstados();
  }
  obtenerEstados() {
    this.estadosService.obtenerEstados().subscribe(
      (estados: Estado[]) => {
        this.estados = estados;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )
  }
  seleccionoEstado() {
    if (this.estado) return true;
    return false;
  }
  buscarMunicipios() {
    this.nuevoAlmacen.direccion.estado = this.estado.nombre;
    this.cargando = this.cargandoService.crearVistaCargando(true,'Buscando municipios');
    this.estadosService.obtenerMunicipios(this.estado._id).subscribe(
      (municipios) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.municipios = municipios;
      },
      (err) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )

  }
  setMunicipio() {
    this.nuevoAlmacen.direccion.ciudad = this.municipio.nombre;
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
