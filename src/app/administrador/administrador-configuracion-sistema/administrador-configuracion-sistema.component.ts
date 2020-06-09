import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { Configuracion } from 'src/app/comun/modelos/usuario.model';
import { ConfiguracionService } from 'src/app/comun/servicios/configuracion.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { environment } from '../../../environments/environment';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
@Component({
  selector: 'app-administrador-configuracion-sistema',
  templateUrl: './administrador-configuracion-sistema.component.html',
  styleUrls: ['./administrador-configuracion-sistema.component.scss'],
  animations: [
    Animaciones.deslizarAbajo,
    Animaciones.carga
  ]
})
export class AdministradorConfiguracionSistemaComponent implements OnInit {
  cargando: boolean = false;
  cargandoImagen: boolean = false;
  configuracion: Configuracion = new Configuracion();

  constructor(private autenticacionService: ServicioAutenticacionService,
    private _serToastr: NgToastrService,
    private cargandoService: CargandoService,
    private configuracionService: ConfiguracionService) { }

 

  ngOnInit() {
    this.obtenerConfiguracion();
  }
  obtenerConfiguracion() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo configuracion');
    this.configuracionService.obtenerConfiguracion().subscribe(
      (configuracion: Configuracion) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.configuracion = configuracion;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this._serToastr.error(err.error.titulo, err.error.detalles);
      }
    );
  }
  
  guardarConfiguracionNotificaciones() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Guardando configuracion');
    this.configuracionService.guardarConfiguracionNotificaciones(this.configuracion.notificaciones).subscribe(
      (resp: Mensaje) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this._serToastr.exito(resp.titulo, resp.detalles, this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this._serToastr.error(err.error.titulo, err.error.detalles, this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
      }
    );
  }
  abrirToastr() {
    this._serToastr.default('Prueba', 'Notificacion de prueba', this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
  }

  ////cropper
  
}
