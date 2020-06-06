import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { RootService } from '../../root.service';
import { Sucursal } from 'src/app/comun/modelos/sucursal.model';
import { NgForm } from '@angular/forms';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-asignar-usuarios-sucursales',
  templateUrl: './asignar-usuarios-sucursales.component.html',
  styleUrls: ['./asignar-usuarios-sucursales.component.scss']
})
export class AsignarUsuariosSucursalesComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  cargando: boolean = false;
  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario;
  sucursales: Sucursal[] = [];
  sucursalSeleccionada: Sucursal;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'seleccionar'];
  seleccionados: boolean[] = [];
  datosTabla: MatTableDataSource<Usuario>;
  busquedaElemento: string = '';

  constructor(private rootService: RootService,
    private cargandoService: CargandoService,
    private toastr: NgToastrService) {

  }

  ngOnInit() {
    this.obtenerUsuariosSinSucursal();
    this.obtenerSucursales();
  }
  obtenerUsuariosSinSucursal() {
    this.cargando = this.cargandoService.crearVistaCargando(true, 'Obteniendo usuarios sin sucursal');
    this.rootService.obtenerUsuariosSinSucursal().subscribe(
      (usuarios: Usuario[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.usuarios = usuarios;
        this.inicializarTabla();
        this.inicializarSeleccionados();
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.titulo, err.error.detalles);
      }
    );
  }
  obtenerSucursales() {
    this.cargando = this.cargandoService.crearVistaCargando(true, 'Obteniendo sucursales');
    this.rootService.obtenerSucursales().subscribe(
      (sucursales: Sucursal[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.sucursales = sucursales;
      },
      (err: any) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.error(err.error.detalles, err.error.titulo);
      }
    );
  }
  asignarSucursal(asignarSucursalForm: NgForm) {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Asignando sucursal');
    this.rootService.asignarSucursal(this.sucursalSeleccionada, this.usuarioSeleccionado).subscribe(
      (usuario: Usuario) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        const indice = this.usuarios.indexOf(this.usuarioSeleccionado);
        this.usuarios.splice(indice, 1);
        this.datosTabla.data = this.usuarios;
        asignarSucursalForm.resetForm();
        this.toastr.abrirToastr('exito','Se ha asignado exitosamente la sucursal', 'Sucursal asignada');
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.titulo, err.error.detalles);
      }
    );
  }
  seleccionarUsuario(usuario: Usuario, indice: number) {
    this.usuarioSeleccionado = usuario;
  }
  inicializarTabla() {
    this.datosTabla = new MatTableDataSource(this.usuarios);
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.filterPredicate = (usuario: Usuario, filtro: string) => {
      return usuario.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
  inicializarSeleccionados() {
    for (let i = 0; i < this.usuarios.length; i++) {
      this.seleccionados[i] = false;
    }
  }
  aplicarFiltroBusqueda() {
    this.datosTabla.filter = this.busquedaElemento.trim().toLowerCase();
  }
  borrarBusqueda() {
    this.busquedaElemento = '';
    this.aplicarFiltroBusqueda();
  }
}
