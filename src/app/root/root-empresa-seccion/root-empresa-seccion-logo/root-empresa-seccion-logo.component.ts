import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmpresaService } from 'src/app/comun/servicios/empresa.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import { DatosEmpresa } from 'src/app/comun/modelos/datos_empresa.model';

@Component({
  selector: 'app-root-empresa-seccion-logo',
  templateUrl: './root-empresa-seccion-logo.component.html',
  styleUrls: ['./root-empresa-seccion-logo.component.scss'],
  animations: [Animaciones.carga]
})
export class RootEmpresaSeccionLogoComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();
  logotipoActual: string = '';
  eventoCambioImagenLogotipo: any = '';
  urlFotos = environment.url_fotos;
  imagenLogoRecortada: string = '';
  cargando: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private cargandoService: CargandoService,
    private toastr: NgToastrService

  ) { }

  ngOnInit(): void {
    //obtenerLogotipo actual
    this.obtenerLogotipoActual()
    this.obtenerNuevoLogotipo();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  obtenerLogotipoActual(){
    this.cargando = this.cargandoService.crearVistaCargando(true);
    this.empresaService.obtenerLogotipoEmpresa().subscribe(
      (empresa: DatosEmpresa) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.logotipoActual = this.urlFotos + empresa.rutaLogo;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
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
  //cropper
  cambioArchivoEvento(event: any) {
    if (event.target.value == '') {
      this.cargando = this.cargandoService.crearVistaCargando(false);
    } else {
      this.cargando = this.cargandoService.crearVistaCargando(true);
      this.eventoCambioImagenLogotipo = event;
    }
  }
  imagenRecortada(evento: ImageCroppedEvent) {
    this.imagenLogoRecortada = evento.base64;
  }
  imagenCargada() {
    // show cropper
    this.cargando = this.cargandoService.crearVistaCargando(false);

  }
  cortadorListo() {
    // cropper ready
    this.cargando = this.cargandoService.crearVistaCargando(false);

  }
  cargarImagenFallida() {
    // show message
    this.cargando = this.cargandoService.crearVistaCargando(false);
  }
  eliminarImagen() {
    this.imagenLogoRecortada = '';
    this.eventoCambioImagenLogotipo = '';
  }
  imagenValida(): boolean {
    return this.imagenLogoRecortada != '' ? true : false;
  }
  guardarImagen() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Guardando imagen');
    const imagen = this.convertirImagen();
    console.log(imagen);
    this.empresaService.cambiarLogotipo(imagen).subscribe(
      (resp: Mensaje) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', resp.titulo, resp.detalles);
        this.eliminarImagen();

      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  convertirImagen() {
    const fecha = new Date().valueOf();
    let texto = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      texto += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    const nombreImagen = fecha + '.' + texto + '.png';
    const imagenBlob = this.datosURIaBlob(this.imagenLogoRecortada);
    return new File([imagenBlob], nombreImagen, { type: 'image/png' });
  }
  datosURIaBlob(datosURI): any {
    const base64 = datosURI.slice(22, -22)
    const stringByte = window.atob(base64);
    const arrayBuffer = new ArrayBuffer(stringByte.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < stringByte.length; i++) {
      int8Array[i] = stringByte.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob
  }
}
