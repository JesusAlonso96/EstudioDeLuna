import { Component, OnInit } from '@angular/core';
import * as momento from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Notificacion } from 'src/app/comun/modelos/notificacion.model';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
declare var $: any;

@Component({
  selector: 'app-empleado-notificaciones',
  templateUrl: './empleado-notificaciones.component.html',
  styleUrls: ['./empleado-notificaciones.component.scss']
})
export class EmpleadoNotificacionesComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  subscripcionNotificaciones: Subscription;
  cargandoEliminacion: boolean;
  constructor(private toastr: NgToastrService, private empleadoService: EmpleadoService, private autService: ServicioAutenticacionService, private pedidosService: PedidosService) { }

  ngOnInit() {
    this.obtenerNotificaciones();
    this.obtenerNotificacionesTiempoReal();
    this.toggleMenu();

  }
  obtenerNotificaciones() {
    var hoy = new Date();
    var fecha = momento(hoy).format('YYYY-MM-DD');
    this.empleadoService.obtenerNotificaciones(this.autService.getIdUsuario(), fecha).subscribe(
      (notificaciones) => {
        console.log("notificacioness", notificaciones)
        this.notificaciones = notificaciones;
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error',err.error.titulo,err.error.detalles);
      }
    );
  }
  toggleMenu() {
    $(document).ready(function () {
      $(".on").click(function () {
        $("#notificationMenu").toggle();
      });
    });
  }
  obtenerNotificacionesTiempoReal() {
    this.subscripcionNotificaciones = this.pedidosService.obtenerNotificaciones().subscribe(
      (notificacion: Notificacion) => {
        this.notificaciones.unshift(notificacion);
        this.toastr.abrirToastr('info','Nueva notificacion','');
      }
    )
  }
  quitarNotificacion(notificacion, indice) {
    this.empleadoService.eliminarNotificacion(notificacion._id).subscribe(
      (eliminada: any) => {
        this.notificaciones.splice(indice, 1);
      },
      (err: HttpErrorResponse) => {
        this.toastr.error('error',err.error.detalles, err.error.titulo);
      }
    );
  }
}
