import { Component, OnInit } from '@angular/core';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import MenuRoot from 'src/app/comun/constantes/menus/menu-root.constant';
import { TemasService } from 'src/app/comun/servicios/temas.service';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { EmpresaService } from 'src/app/comun/servicios/empresa.service';
import { DatosEmpresa } from 'src/app/comun/modelos/datos_empresa.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root-main-nav',
  templateUrl: './root-main-nav.component.html',
  styleUrls: ['./root-main-nav.component.scss'],
  animations: [Animaciones.toggle, Animaciones.rotacion]

})
export class RootMainNavComponent implements OnInit {
  menus: any[] = [];
  pestanasActivas: boolean[] = [];
  moduloActual: string = '';
  logotipoActual: string = '';
  private onDestroy$ = new Subject<boolean>();
  urlFotos = environment.url_fotos;

  cargando = {
    cargando: false,
    texto: ''
  }
  constructor(private breakpointObserver: BreakpointObserver,
    private autenticacionService: ServicioAutenticacionService,
    private cargandoService: CargandoService,
    private temasService: TemasService,
    private toastr: NgToastrService,
    private empresaService: EmpresaService,
    private rutas: Router) {
    this.cargandoService.cambioEmitido$.subscribe(
      cargando => {
        this.cargando.cargando = cargando.cargando;
        this.cargando.texto = cargando.texto;
      }
    )
  }

  ngOnInit() {
    this.temasService.iniciarTemas();
    this.menus = MenuRoot;
    this.iniciarPestanas();
    this.buscarPestanaActiva();
    this.obtenerLogoActual();
    this.obtenerNuevoLogotipo();
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
    activarPestana(indice: number, nombre: string) {
      this.activarModuloActivo(nombre);
      this.pestanasActivas[indice] = true;
    }
    activarModuloActivo(nombre: string) {
      this.moduloActual = nombre;
      localStorage.setItem('moduloActual', nombre);
      this.iniciarPestanas();
    }
    iniciarPestanas() {
      for (let i = 0; i < this.menus.length; i++) {
        this.pestanasActivas[i] = false;
      }
    }
    buscarPestanaActiva() {
      const nombre: string = localStorage.getItem('moduloActual');
      this.moduloActual = nombre;
      const pestana = this.menus.find(menu => menu.nombre == nombre);
      this.pestanasActivas[this.menus.indexOf(pestana)] = true;
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
    /* LOGOTIPO */
    obtenerLogoActual(){
      this.cargandoService.crearVistaCargando(true);
      this.empresaService.obtenerLogotipoEmpresa().subscribe(
        (empresa: DatosEmpresa) => {
          this.cargandoService.crearVistaCargando(false);
          this.logotipoActual = this.urlFotos + empresa.rutaLogo;
        },
        (err: HttpErrorResponse) => {
          this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        }
      );
    }
    obtenerNuevoLogotipo() {
      this.empresaService.escucharNuevoLogo()
        .pipe(
          takeUntil(this.onDestroy$)
        )
        .subscribe(
          (logotipo: { ruta: string }) => {
            this.logotipoActual = this.urlFotos + logotipo.ruta;
          }
        );
    }
}
