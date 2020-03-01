import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Almacen } from 'src/app/comun/modelos/almacen.model';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { ToastrService } from 'ngx-toastr';
import { Municipio } from 'src/app/comun/modelos/municipio.model';
import { Estado } from 'src/app/comun/modelos/estado.model';

@Component({
  selector: 'app-editar-almacen',
  templateUrl: './editar-almacen.component.html',
  styleUrls: ['./editar-almacen.component.scss']
})
export class EditarAlmacenComponent implements OnInit {
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  cargando: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<EditarAlmacenComponent>,
    @Inject(MAT_DIALOG_DATA) public almacen: Almacen,
    private estadosService: EstadosService,
    private toastr: ToastrService) {
    console.log(almacen)
  }

  ngOnInit() {
    this.obtenerEstados();
  }
  obtenerEstados() {
    this.estadosService.obtenerEstados().subscribe(
      (estados) => {
        this.estados = estados;
        this.obtenerMunicipiosDeEstadoSeleccionado();
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerMunicipiosDeEstadoSeleccionado() {
    let idSeleccionado: string;
    for (let i = 0; i < this.estados.length; i++) {
      if (this.estados[i].nombre == this.almacen.direccion.estado) {
        idSeleccionado = this.estados[i]._id;
        break;
      }
    }
    this.buscarMunicipios(idSeleccionado);
  }
  buscarMunicipios(idEstado: string) {
    this.estadosService.obtenerMunicipios(idEstado).subscribe(
      (municipios) => {
        this.municipios = municipios;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

}
