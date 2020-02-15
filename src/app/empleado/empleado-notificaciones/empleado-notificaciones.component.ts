import { Component, OnInit } from '@angular/core';
import * as momento from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Notificacion } from 'src/app/comun/modelos/notificacion.model';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { PedidosService } from '../servicio-empleado/pedidos.service';
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
  constructor(private toastr: ToastrService, private empleadoService: EmpleadoService, private autService: ServicioAutenticacionService, private pedidosService: PedidosService) { }

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
        this.notificaciones = notificaciones;
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
        this.toastr.info('Nueva notificacion');
      }
    )
  }
  quitarNotificacion(notificacion, indice) {
    this.empleadoService.eliminarNotificacion(notificacion._id).subscribe(
      (eliminada: any) => {
        this.notificaciones.splice(indice, 1);
      },
      (err: any) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
}
