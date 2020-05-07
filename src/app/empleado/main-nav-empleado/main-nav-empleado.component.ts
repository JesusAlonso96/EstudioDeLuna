import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ServicioAutenticacionService } from '../../autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Router } from '@angular/router';
import { TemasService } from 'src/app/comun/servicios/temas.service';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
@Component({
  selector: 'app-main-nav-empleado',
  templateUrl: './main-nav-empleado.component.html',
  styleUrls: ['./main-nav-empleado.component.scss'],
  animations: [Animaciones.toggle, Animaciones.rotacion]
})
export class MainNavEmpleadoComponent implements OnInit {
  navbarAbierto: boolean = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public autenticacionService: ServicioAutenticacionService,
    public temasService: TemasService,
    private toastr: NgToastrService,
    private rutas: Router) { }
  ngOnInit(): void {
    this.temasService.iniciarTemas();
  }
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
  cambiarTema(tema: string) {
    this.temasService.cambiarTema(tema);
    this.temasService.actualizarTemaUsuario(tema).subscribe(
      (resp: Mensaje) => {
        this.toastr.abrirToastr('exito', resp.titulo, resp.detalles);
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  toggleNavbar(){
    this.navbarAbierto = !this.navbarAbierto;
  }
  ocultarNavbar(): boolean {
    return this.rutas.url.indexOf('nuevaVenta') !== -1
  }
}
