import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-seleccionar-empleado',
  templateUrl: './seleccionar-empleado.component.html',
  styleUrls: ['./seleccionar-empleado.component.scss']
})
export class SeleccionarEmpleadoComponent implements OnInit {
  empleados: Usuario[];
  cargando: boolean = false;
  seleccionados: boolean[] = [];
  seleccionado: Usuario;
  constructor(public dialogRef: MatDialogRef<SeleccionarEmpleadoComponent>, 
    private usuarioService: UsuarioService, 
    private toastr: NgToastrService,
    private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerFotografos();
  }
  obtenerFotografos() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo fotografos');
    this.usuarioService.obtenerFotografos().subscribe(
      (fotografos: Usuario[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.empleados = fotografos;
        this.iniciarSeleccionados();
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.titulo, err.error.detalles);
      }
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  seleccionarEmpleado(empleado: Usuario, indice: number) {
    this.iniciarSeleccionados();
    this.seleccionados[indice] = true;
    this.seleccionado = empleado;
  }
  iniciarSeleccionados() {
    for (let i = 0; i < this.empleados.length; i++) {
      this.seleccionados[i] = false;
    }
  }
  limpiarSeleccionado(){
    this.iniciarSeleccionados();
    this.seleccionado = undefined;
  }

}
