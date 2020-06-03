import { Component, OnInit } from '@angular/core';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-root-main-nav',
  templateUrl: './root-main-nav.component.html',
  styleUrls: ['./root-main-nav.component.scss']
})
export class RootMainNavComponent implements OnInit {
  cargando = {
    cargando: false,
    texto: ''
  }
  constructor(private breakpointObserver: BreakpointObserver,
    private autenticacionService: ServicioAutenticacionService,
    private cargandoService: CargandoService,
    private rutas: Router) {
    this.cargandoService.cambioEmitido$.subscribe(
      cargando => {
        this.cargando.cargando = cargando.cargando;
        this.cargando.texto = cargando.texto;
      }
    )
  }

  ngOnInit() {
  }

  cerrarSesion() {
    this.autenticacionService.cerrarSesion();
    this.rutas.navigate(['/login']);
  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
