import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { ToastrService } from 'ngx-toastr';
export class DatosRecuperacion {
  contrasena: string;
  codigo: string;
  constructor() { }
}
@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent implements OnInit {
  cargando: boolean = false;
  email: string;
  generado: boolean;
  mensaje: string = '';
  correoIngresado: string = localStorage.getItem('c-rec');
  datosRecuperacion: DatosRecuperacion = new DatosRecuperacion();

  constructor(public dialogRef: MatDialogRef<RecuperarContrasenaComponent>,
    private usuarioService: UsuarioService,
    private toastr: ToastrService) { }

  ngOnInit() {
    if (this.correoIngresado) {
      this.generado = true;
    }
  }
  generarCodigoRecuperacion() {
    this.cargando = true;
    this.mensaje = '';
    this.generado = undefined;
    this.usuarioService.generarCodigoRecuperacion({ email: this.email }).subscribe(
      (generado: Mensaje) => {
        this.cargando = false;
        this.generado = true;
        this.mensaje = generado.detalles;
        localStorage.setItem('c-rec', this.email);
        this.correoIngresado = localStorage.getItem('c-rec');
      },
      (err: any) => {
        this.cargando = false;
        this.generado = false;
        this.mensaje = err.error.detalles;
      }
    );
  }
  cancelarRecuperacion() {
    this.cargando = true;
    this.usuarioService.eliminarCodigoRecuperacion({ email: this.correoIngresado }).subscribe(
      (eliminado: Mensaje) => {
        this.cargando = false;
        localStorage.removeItem('c-rec');
        this.toastr.info(eliminado.detalles, eliminado.titulo, { closeButton: true });
        this.dialogRef.close();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );

  }
  cambiarContrasena() {
    this.cargando = true;
    this.usuarioService.cambiarContrasena(this.correoIngresado, this.datosRecuperacion).subscribe(
      (actualizada: Mensaje) => {
        this.cargando = false;
        localStorage.removeItem('c-rec');
        this.dialogRef.close();
        this.toastr.info(actualizada.detalles, actualizada.titulo, { closeButton: true });
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

}
