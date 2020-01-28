import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { ServicioAutenticacionService } from '../../autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-nav-empleado',
  templateUrl: './main-nav-empleado.component.html',
  styleUrls: ['./main-nav-empleado.component.scss']
})
export class MainNavEmpleadoComponent  {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public autenticacionService: ServicioAutenticacionService, private rutas: Router) { }
  cerrarSesion() {
    this.autenticacionService.cerrarSesion();
    this.rutas.navigate(['/login']);
  }
  esRecepcionista(): boolean {
    if (this.autenticacionService.getTipoTrabajador() == 2) {
      return true;
    }
    return false
  }
}
