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
export class AdministradorConfiguracionSistemaComponent implements OnInit, OnDestroy {
  cargando: boolean = false;
  cargandoImagen: boolean = false;
  configuracion: Configuracion = new Configuracion();
  imagenLogoRecortada: string = '';
  eventoCambioImagenLogotipo: any = '';
  urlFotos = environment.url_fotos;
  logotipoActual: string = '';
  private onDestroy$ = new Subject<boolean>();

  constructor(private autenticacionService: ServicioAutenticacionService,
    private _serToastr: NgToastrService,
    private cargandoService: CargandoService,
    private configuracionService: ConfiguracionService) { }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.logotipoActual = this.autenticacionService.getRutaLogo();
    this.obtenerConfiguracion();
    this.obtenerNuevoLogotipo();
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
  obtenerNuevoLogotipo() {
    this.configuracionService.escucharNuevoLogo()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (logotipo: { ruta: string }) => {
          this.logotipoActual = this.urlFotos + logotipo.ruta;
          this.actualizarUsuarioLocal(logotipo.ruta);
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
  actualizarUsuarioLocal(rutaLogo: any) {
    const usuario: any = this.autenticacionService.getTokenDesencriptado();
    usuario.logo = rutaLogo;
    localStorage.setItem('usuario_meta', JSON.stringify(usuario));
  }
  ////cropper
  cambioArchivoEvento(event: any) {
    if (event.target.value == '') {
      this.cargando = this.cargandoService.crearVistaCargando(false);
    } else {
      this.cargando = this.cargandoService.crearVistaCargando(true);
      this.eventoCambioImagenLogotipo = event;
    }
  }
  imagenRecortada(evento: ImageCroppedEvent) {
    this.imagenLogoRecortada = evento.base64;
  }
  imagenCargada() {
    // show cropper
    this.cargando = this.cargandoService.crearVistaCargando(false);

  }
  cortadorListo() {
    // cropper ready
    this.cargando = this.cargandoService.crearVistaCargando(false);

  }
  cargarImagenFallida() {
    // show message
    this.cargando = this.cargandoService.crearVistaCargando(false);
  }
  eliminarImagen() {
    this.imagenLogoRecortada = '';
    this.eventoCambioImagenLogotipo = '';
  }
  imagenValida(): boolean {
    return this.imagenLogoRecortada != '' ? true : false;
  }
  guardarImagen() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Guardando imagen');
    this.configuracionService.cambiarLogotipo(this.convertirImagen()).subscribe(
      (resp: Mensaje) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this._serToastr.abrirToastr('exito', resp.titulo, resp.detalles);
        this.eliminarImagen();

      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this._serToastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  convertirImagen() {
    const fecha = new Date().valueOf();
    let texto = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      texto += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    const nombreImagen = fecha + '.' + texto + '.png';
    const imagenBlob = this.datosURIaBlob(this.imagenLogoRecortada);
    return new File([imagenBlob], nombreImagen, { type: 'image/png' });
  }
  datosURIaBlob(datosURI): any {
    const base64 = datosURI.slice(22, -22)
    const stringByte = window.atob(base64);
    const arrayBuffer = new ArrayBuffer(stringByte.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < stringByte.length; i++) {
      int8Array[i] = stringByte.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob
  }
}
