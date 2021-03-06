import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { ServicioAutenticacionService } from '../../autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Router } from '@angular/router';
import { TemasService } from 'src/app/comun/servicios/temas.service';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import MenuRecepcionista from 'src/app/comun/constantes/menus/menu-empleado-recepcionista.constant';
import MenuFotografo from 'src/app/comun/constantes/menus/menu-empleado-fotografo';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { EmpresaService } from 'src/app/comun/servicios/empresa.service';
import { DatosEmpresa } from 'src/app/comun/modelos/datos_empresa.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-nav-empleado',
  templateUrl: './main-nav-empleado.component.html',
  styleUrls: ['./main-nav-empleado.component.scss'],
  animations: [Animaciones.toggle, Animaciones.rotacion]
})
export class MainNavEmpleadoComponent implements OnInit, AfterViewInit {
  menus: any = [];
  pestanasActivas: boolean[] = [];
  navbarAbierto: boolean = true;
  moduloActual: string = '';
  logotipoActual: string = '';
  private onDestroy$ = new Subject<boolean>();
  urlFotos = environment.url_fotos;
  cargando = {
    cargando: false,
    texto: ''
  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private cargandoService: CargandoService,
    private breakpointObserver: BreakpointObserver,
    public autenticacionService: ServicioAutenticacionService,
    public temasService: TemasService,
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
  ngAfterViewInit(){
    setTimeout(() => {
      this.temasService.iniciarTemas();
    })
  }
  ngOnInit(): void {
    this.iniciarMenus();
    this.iniciarPestanas();
    this.buscarPestanaActiva();
    this.obtenerLogoActual();
    this.obtenerNuevoLogotipo();
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
  toggleNavbar() {
    this.navbarAbierto = !this.navbarAbierto;
  }
  ocultarNavbar(): boolean {
    return this.rutas.url.indexOf('nuevaVenta') !== -1
  }
  obtenerNombreUsuario(): string {
    return this.autenticacionService.getNombreUsuario();
  }
  iniciarMenus() {
    if (this.esRecepcionista()) this.menus = MenuRecepcionista;
    else this.menus = MenuFotografo;
  }
  iniciarPestanas() {
    for (let i = 0; i < this.menus.length; i++) {
      this.pestanasActivas[i] = false;
    }
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
  buscarPestanaActiva() {
    const nombre: string = localStorage.getItem('moduloActual');
    this.moduloActual = nombre;
    const pestana = this.menus.find(menu => menu.nombre == nombre);
    this.pestanasActivas[this.menus.indexOf(pestana)] = true;
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
