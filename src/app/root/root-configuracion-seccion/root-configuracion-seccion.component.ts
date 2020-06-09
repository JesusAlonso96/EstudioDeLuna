import { Component, OnInit } from '@angular/core';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { ConfiguracionService } from 'src/app/comun/servicios/configuracion.service';
import { Configuracion } from 'src/app/comun/modelos/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { Animaciones } from 'src/app/comun/constantes/animaciones';

@Component({
  selector: 'app-root-configuracion-seccion',
  templateUrl: './root-configuracion-seccion.component.html',
  styleUrls: ['./root-configuracion-seccion.component.scss'],
  animations: [Animaciones.deslizarAbajo]
})
export class RootConfiguracionSeccionComponent implements OnInit {
  cargando: boolean = false;
  configuracion: Configuracion = new Configuracion();
  /* SECCION DE LOGOTIPO */
  imagenLogoRecortada: string = '';
  logotipoActual: string = '';
  eventoCambioImagenLogotipo: string = '';
  constructor(
    private toastr: NgToastrService,
    private configuracionService: ConfiguracionService,
    private cargandoService: CargandoService) { }

  ngOnInit(): void {
    this.obtenerConfiguracion();
  }
  obtenerConfiguracion() {
    this.cargando = this.cargandoService.crearVistaCargando(true, 'Obteniendo la configuracion del usuario')
    this.configuracionService.obtenerConfiguracion().subscribe(
      (configuracion: Configuracion) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.configuracion = configuracion;
        console.log(this.configuracion);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  abrirToastr() {
    this.toastr.default('Prueba', 'Notificacion de prueba', this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
  }
  guardarConfiguracionNotificaciones() {
    this.cargando = this.cargandoService.crearVistaCargando(true, 'Guardando configuracion');
    this.configuracionService.guardarConfiguracionNotificaciones(this.configuracion.notificaciones).subscribe(
      (resp: Mensaje) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.exito(resp.titulo, resp.detalles, this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.error(err.error.titulo, err.error.detalles, this.configuracion.notificaciones.botonCerrar, this.configuracion.notificaciones.tiempo, this.configuracion.notificaciones.posicion, this.configuracion.notificaciones.barraProgreso);
      }
    );
  }

  /* SECCION DE LOGOTIPO */
  imagenValida(): boolean {
    return this.imagenLogoRecortada != '' ? true : false;
  }
  guardarImagen() {

  }
  cargarImagenFallida() {

  }
  eliminarImagen() {

  }
  cortadorListo(){

  }
  imagenCargada(){

  }
  imagenRecortada(evento: any){

  }
  cambioArchivoEvento(evento: any){
    
  }
}
