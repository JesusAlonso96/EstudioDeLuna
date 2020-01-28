import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cliente } from 'src/app/comun/modelos/cliente.model';
import { Estado } from 'src/app/comun/modelos/estado.model';
import { Municipio } from 'src/app/comun/modelos/municipio.model';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.scss']
})
export class EditarClienteComponent implements OnInit {
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  constructor(public dialogRef: MatDialogRef<EditarClienteComponent>, @Inject(MAT_DIALOG_DATA) public data: Cliente, private estadoService: EstadosService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerEstados();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  obtenerEstados() {
    this.estadoService.obtenerEstados().subscribe(
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
      if (this.estados[i].nombre == this.data.estado) {
        idSeleccionado = this.estados[i]._id;
        break;
      }
    }
    this.buscarMunicipios(idSeleccionado);
  }
  buscarMunicipios(idEstado: string) {
    this.estadoService.obtenerMunicipios(idEstado).subscribe(
      (municipios) => {
        this.municipios = municipios;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
}
