import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';

@Component({
  selector: 'app-cambiar-permisos',
  templateUrl: './cambiar-permisos.component.html',
  styleUrls: ['./cambiar-permisos.component.scss']
})
export class CambiarPermisosComponent implements OnInit {
  rol_anterior: Number;
  rol_sec_anterior: Number;
  constructor(
    public dialogRef: MatDialogRef<CambiarPermisosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario, private adminService: AdministradorService, private toastr: ToastrService, private autService: ServicioAutenticacionService) { }


  ngOnInit() {
    this.rol_anterior = this.data.rol;
    this.rol_sec_anterior = this.data.rol_sec;
  }
  cambiarPermisos() {
    if (this.rol_anterior == 0 && this.rol_anterior != this.data.rol) {
      this.data.rol_sec = 0;
    }
    this.adminService.cambiarPermisos(this.data).subscribe(
      (actualizado) => {
        this.toastr.success(actualizado.detalles, actualizado.titulo, { closeButton: true });
        this.esMiPerfil();
        this.dialogRef.close();
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.dialogRef.close();
      }
    )

  }
  esMiPerfil(){
    if(this.autService.getIdUsuario() == this.data._id) {
      this.toastr.info('Se han cambiado los permisos de tu perfil', 'Inicia sesión nuevamente', {closeButton:true});
      this.autService.cerrarSesion();
    }
  }
  onNoClick(): void {
    this.data.rol = this.rol_anterior;
    this.data.rol_sec = this.rol_sec_anterior;
    this.dialogRef.close();
  }

}
