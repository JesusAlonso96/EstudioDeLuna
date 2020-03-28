import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Notificaciones } from '../modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class NgToastrService {
  configuracionesDefault = {
    closeButton: false,
    timeOut: 2000,
    positionClass: 'toast-top-right',
    progressBar: false
  }
  configuraciones = {
    // clos
  }
  constructor(private toastr: ToastrService,
    private autService: ServicioAutenticacionService) { }
  default(titulo: string, mensaje: string, closeButton?: boolean, timeOut?: number, positionClass?: string, progressBar?: boolean) {
    this.toastr.success(mensaje, titulo, {
      closeButton: closeButton ? closeButton : this.configuracionesDefault.closeButton,
      timeOut: timeOut ? timeOut : this.configuracionesDefault.timeOut,
      positionClass: positionClass ? positionClass : this.configuracionesDefault.positionClass,
      progressBar: progressBar ? progressBar : this.configuracionesDefault.progressBar
    })
  }
  exito(titulo: string, mensaje: string, closeButton?: boolean, timeOut?: number, positionClass?: string, progressBar?: boolean) {
    this.toastr.success(mensaje, titulo, {
      closeButton: closeButton ? closeButton : this.configuracionesDefault.closeButton,
      timeOut: timeOut ? timeOut : this.configuracionesDefault.timeOut,
      positionClass: positionClass ? positionClass : this.configuracionesDefault.positionClass,
      progressBar: progressBar ? progressBar : this.configuracionesDefault.progressBar
    })
  }
  error(titulo: string, mensaje: string, closeButton?: boolean, timeOut?: number, positionClass?: string, progressBar?: boolean) {
    this.toastr.error(mensaje, titulo, {
      closeButton: closeButton ? closeButton : this.configuracionesDefault.closeButton,
      timeOut: timeOut ? timeOut : this.configuracionesDefault.timeOut,
      positionClass: positionClass ? positionClass : this.configuracionesDefault.positionClass,
      progressBar: progressBar ? progressBar : this.configuracionesDefault.progressBar
    })
  }
  advertencia(titulo: string, mensaje: string, closeButton?: boolean, timeOut?: number, positionClass?: string, progressBar?: boolean) {
    this.toastr.warning(mensaje, titulo, {
      closeButton: closeButton ? closeButton : this.configuracionesDefault.closeButton,
      timeOut: timeOut ? timeOut : this.configuracionesDefault.timeOut,
      positionClass: positionClass ? positionClass : this.configuracionesDefault.positionClass,
      progressBar: progressBar ? progressBar : this.configuracionesDefault.progressBar
    })
  }
  info(titulo: string, mensaje: string, closeButton?: boolean, timeOut?: number, positionClass?: string, progressBar?: boolean) {
    this.toastr.info(mensaje, titulo, {
      closeButton: closeButton ? closeButton : this.configuracionesDefault.closeButton,
      timeOut: timeOut ? timeOut : this.configuracionesDefault.timeOut,
      positionClass: positionClass ? positionClass : this.configuracionesDefault.positionClass,
      progressBar: progressBar ? progressBar : this.configuracionesDefault.progressBar
    })
  }
  abrirToastr(tipo: string, titulo: string, mensaje: string) {
    let configuracionUsuario: Notificaciones = new Notificaciones();
    configuracionUsuario = this.autService.getConfiguracionNotificaciones();
    switch (tipo) {
      case 'exito': this.exito(titulo, mensaje, configuracionUsuario.botonCerrar, configuracionUsuario.tiempo, configuracionUsuario.posicion, configuracionUsuario.barraProgreso); break;
      case 'error': this.error(titulo, mensaje, configuracionUsuario.botonCerrar, configuracionUsuario.tiempo, configuracionUsuario.posicion, configuracionUsuario.barraProgreso); break;
      case 'advertencia': this.advertencia(titulo, mensaje, configuracionUsuario.botonCerrar, configuracionUsuario.tiempo, configuracionUsuario.posicion, configuracionUsuario.barraProgreso); break;
      case 'info': this.info(titulo, mensaje, configuracionUsuario.botonCerrar, configuracionUsuario.tiempo, configuracionUsuario.posicion, configuracionUsuario.barraProgreso); break;
    }
  }
}
