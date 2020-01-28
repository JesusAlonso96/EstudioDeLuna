import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { Notificacion } from 'src/app/comun/modelos/notificacion.model';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import * as momento from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-empleado-notificaciones',
  templateUrl: './empleado-notificaciones.component.html',
  styleUrls: ['./empleado-notificaciones.component.scss']
})
export class EmpleadoNotificacionesComponent implements OnInit {

  notificaciones: Notificacion[];
  cargandoEliminacion: boolean;
  constructor(private toastr: ToastrService, private empleadoService: EmpleadoService, private autService: ServicioAutenticacionService) {
    this.notificaciones = [];
    this.cargandoEliminacion = false;
  }

  ngOnInit() {
    this.obtenerNotificaciones();
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
        $("#notificationMenu").toggle("linear")
      });
    });
  }
  quitarNotificacion(notificacion, indice) {
    this.notificaciones.splice(indice, 1);
    //this.cargandoEliminacion = true;
    this.empleadoService.eliminarNotificacion(notificacion._id).subscribe(
      () => {
        this.cargandoEliminacion = false;
      },
      () => {
        this.cargandoEliminacion = false;
        this.toastr.error('No se pudo eliminar de la cola al notificacion')
      }
    );
  }
}
