import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { Estado } from 'src/app/comun/modelos/estado.model';
import { ToastrService } from 'ngx-toastr';
import { Municipio } from 'src/app/comun/modelos/municipio.model';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.scss']
})
export class EditarProveedorComponent implements OnInit {
  estados: Estado[] = [];
  cargandoMunicipio: boolean = false;
  municipios: Municipio[] = [];
  constructor(private estadoService: EstadosService, public dialogRef: MatDialogRef<EditarProveedorComponent>, @Inject(MAT_DIALOG_DATA) public proveedor: Proveedor, private toastr: ToastrService) { }
  ngOnInit() {
    this.obtenerEstados();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  obtenerEstados() {
    this.estadoService.obtenerEstados().subscribe(
      (estados: Estado[]) => {
        this.estados = estados;
        this.obtenerMunicipiosDeEstadoSeleccionado();
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  buscarMunicipios(id: string) {
    this.cargandoMunicipio = true;
    this.estadoService.obtenerMunicipios(id).subscribe(
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
  obtenerMunicipiosDeEstadoSeleccionado() {
    let idSeleccionado: string;
    for (let i = 0; i < this.estados.length; i++) {
      if (this.estados[i].nombre == this.proveedor.estado) {
        idSeleccionado = this.estados[i]._id;
        break;
      }
    }
    this.buscarMunicipios(idSeleccionado);
  }
}
