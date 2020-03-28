import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/comun/servicios/datos.service';
import { DatosEstudio } from 'src/app/comun/modelos/datos_estudio.model';
import { ToastrService } from 'ngx-toastr';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Configuracion } from 'src/app/comun/modelos/usuario.model';
import { ConfiguracionService } from 'src/app/comun/servicios/configuracion.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';

@Component({
  selector: 'app-administrador-configuracion-sistema',
  templateUrl: './administrador-configuracion-sistema.component.html',
  styleUrls: ['./administrador-configuracion-sistema.component.scss']
})
export class AdministradorConfiguracionSistemaComponent implements OnInit {
  datosEstudio: DatosEstudio = new DatosEstudio();
  cargando: boolean = false;
  configuracion: Configuracion = new Configuracion();
  constructor(private datosService: DatosService,
    private _serToastr: NgToastrService,
    private configService: ConfiguracionService) { }

  ngOnInit() {
    this.obtenerConfiguracion();
  }
  obtenerConfiguracion() {
    this.cargando = true;
    this.configService.obtenerConfiguracion().subscribe(
      (configuracion: Configuracion) => {
        this.cargando = false;
        this.configuracion = configuracion;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this._serToastr.error(err.error.titulo, err.error.detalles);
      }
    );
  }
  guardarConfiguracionNotificaciones() {
    this.cargando = true;
    this.configService.guardarConfiguracionNotificaciones(this.configuracion.notificaciones).subscribe(
      (resp: Mensaje) => {
        this.cargando = false;
        this._serToastr.exito(resp.titulo, resp.detalles, this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this._serToastr.error(err.error.titulo, err.error.detalles, this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
      }
    );
  }
  abrirToastr() {
    this._serToastr.default('Prueba', 'Notificacion de prueba', this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
  }

}
