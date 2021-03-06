import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Pestana } from 'src/app/comun/modelos/pestana.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { TemasService } from 'src/app/comun/servicios/temas.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { EmpresaService } from 'src/app/comun/servicios/empresa.service';
import { DatosEmpresa } from 'src/app/comun/modelos/datos_empresa.model';

@Component({
  selector: 'app-main-nav-admin',
  templateUrl: './main-nav-admin.component.html',
  styleUrls: ['./main-nav-admin.component.scss'],
  animations: [Animaciones.deslizarAbajo, Animaciones.deslizarDerecha, Animaciones.rotacion]
})
export class MainNavAdminComponent implements OnInit,AfterViewInit {
  @HostListener('scroll', ['$event'])
  pestanasActivas: boolean[] = [];
  pestanas: Pestana[] = [];
  urlFotos = environment.url_fotos;
  logotipoActual: string = '';
  moduloActual: string = '';
  mostrarToggleSidebar: boolean = false;
  cargando = {
    cargando: false,
    texto: ''
  }
  private onDestroy$ = new Subject<boolean>();

  constructor(
    private cargandoService: CargandoService,
    private breakpointObserver: BreakpointObserver,
    public autenticacionService: ServicioAutenticacionService,
    public temasService: TemasService,
    private rutas: Router,
    private usuarioService: UsuarioService,
    private toastr: NgToastrService,
    private empresaService: EmpresaService) {
    this.cargandoService.cambioEmitido$.subscribe(
      cargando => {
        this.cargando.cargando = cargando.cargando;
        this.cargando.texto = cargando.texto;
      }
    )
  }
  scrollHandler($event: any) {
    let scrollOffset = $event.srcElement.scrollTop;
    if (scrollOffset >= 100) this.mostrarToggleSidebar = true;
    if (scrollOffset <= 25) this.mostrarToggleSidebar = false;
  }
  ngAfterViewInit(){
    setTimeout(() => {
      this.temasService.iniciarTemas();
    })
  }
  ngOnInit() {
    this.obtenerPestanas();
    this.obtenerLogoActual();
    this.obtenerNuevoLogotipo();

  }
  obtenerPestanas() {
    this.usuarioService.obtenerPestanas('Administrador').subscribe(
      (pestanas: Pestana[]) => {
        this.pestanas = pestanas;
        this.iniciarPestanas();
        this.iniciarRutaActual();
        this.buscarPestanaActiva();
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  obtenerLogoActual() {
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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  cerrarSesion() {
    this.autenticacionService.cerrarSesion();
    this.rutas.navigate(['/login']);
  }
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
    for (let i = 0; i < this.pestanas.length; i++) {
      this.pestanasActivas[i] = false;
    }
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
  temaActivo(tema: string): boolean {
    return this.temasService.temaActivo(tema)
  }
  obtenerNombreUsuario(): string {
    return this.autenticacionService.getNombreUsuario();
  }
  iniciarRutaActual() {
    this.moduloActual = localStorage.getItem('moduloActual');
  }
  buscarPestanaActiva() {
    const nombre: string = localStorage.getItem('moduloActual');
    const pestana = this.pestanas.find(pestana => pestana.nombre == nombre);
    this.pestanasActivas[this.pestanas.indexOf(pestana)] = true;
  }

}
