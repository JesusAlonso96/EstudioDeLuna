import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';


@Component({
  selector: 'app-main-nav-admin',
  templateUrl: './main-nav-admin.component.html',
  styleUrls: ['./main-nav-admin.component.scss']
})
export class MainNavAdminComponent implements OnInit {
  pestanasTam: number = 11;
  pestanasActivas: boolean[] = [];
  constructor(private breakpointObserver: BreakpointObserver, public autenticacionService: ServicioAutenticacionService, private rutas: Router) {
  }
  ngOnInit() {
    this.iniciarPestanas();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  cerrarSesion() {
    this.autenticacionService.cerrarSesion();
    this.rutas.navigate(['/login']);
  }
  activarPestana(indice: number) {
    this.iniciarPestanas();
    this.pestanasActivas[indice] = true;
  }
  iniciarPestanas() {
    for (let i = 0; i < this.pestanasTam; i++) {
      this.pestanasActivas[i] = false;
    }
  }

}
