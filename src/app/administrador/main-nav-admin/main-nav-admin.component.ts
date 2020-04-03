import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Pestana } from 'src/app/comun/modelos/pestana.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { TemasService } from 'src/app/comun/servicios/temas.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-main-nav-admin',
  templateUrl: './main-nav-admin.component.html',
  styleUrls: ['./main-nav-admin.component.scss']
})
export class MainNavAdminComponent implements OnInit {
  pestanasActivas: boolean[] = [];
  pestanas: Pestana[] = [];
  constructor(private breakpointObserver: BreakpointObserver, 
    public autenticacionService: ServicioAutenticacionService,
    public temasService: TemasService, 
    private rutas: Router, private usuarioService: UsuarioService, 
    private toastr: NgToastrService) {
  }
  ngOnInit() {
    console.log("acabo de inciiarrasjasdnkjn")
    this.obtenerPestanas();
    this.temasService.iniciarTemas();
  }
  obtenerPestanas() {
    this.usuarioService.obtenerPestanas('Administrador').subscribe(
      (pestanas: Pestana[]) => {
        this.pestanas = pestanas;
        this.iniciarPestanas();
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );

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
    for (let i = 0; i < this.pestanas.length; i++) {
      this.pestanasActivas[i] = false;
    }
  }
  cambiarTema(tema: string) {
    this.temasService.cambiarTema(tema);
    this.temasService.actualizarTemaUsuario(tema).subscribe(
      (resp: Mensaje)=>{
        this.toastr.abrirToastr('exito', resp.titulo, resp.detalles);
      },
      (err: HttpErrorResponse)=>{
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  temaActivo(tema: string): boolean {
    return this.temasService.temaActivo(tema)
  }

}
