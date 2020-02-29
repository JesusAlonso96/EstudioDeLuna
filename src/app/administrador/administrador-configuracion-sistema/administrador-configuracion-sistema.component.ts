import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/comun/servicios/datos.service';
import { DatosEstudio } from 'src/app/comun/modelos/datos_estudio.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administrador-configuracion-sistema',
  templateUrl: './administrador-configuracion-sistema.component.html',
  styleUrls: ['./administrador-configuracion-sistema.component.scss']
})
export class AdministradorConfiguracionSistemaComponent implements OnInit {
  datosEstudio: DatosEstudio = new DatosEstudio();
  cargando: boolean = false;
  constructor(private datosService: DatosService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerDatosEstudio();
  }
  obtenerDatosEstudio() {
    this.cargando = true;
    this.datosService.obtenerDatosEstudio().subscribe(
      (datos: DatosEstudio) => {
        this.cargando = false;
        this.datosEstudio = datos;
        console.log(this.datosEstudio);
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

}
