import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { RootService } from '../../root.service';
import { Sucursal } from 'src/app/comun/modelos/sucursal.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-asignar-usuarios-sucursales',
  templateUrl: './asignar-usuarios-sucursales.component.html',
  styleUrls: ['./asignar-usuarios-sucursales.component.scss']
})
export class AsignarUsuariosSucursalesComponent implements OnInit {
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
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
    private toastr: ToastrService) {

  }

  ngOnInit() {
    this.obtenerUsuariosSinSucursal();
    this.obtenerSucursales();
  }
  obtenerUsuariosSinSucursal() {
    this.cargando = true;
    this.rootService.obtenerUsuariosSinSucursal().subscribe(
      (usuarios: Usuario[]) => {
        this.cargando = false;
        this.usuarios = usuarios;
        this.inicializarTabla();
        this.inicializarSeleccionados();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerSucursales() {
    this.cargando = true;
    this.rootService.obtenerSucursales().subscribe(
      (sucursales: Sucursal[]) => {
        this.cargando = false;
        this.sucursales = sucursales;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  asignarSucursal(asignarSucursalForm: NgForm) {
    this.cargando = true;
    this.rootService.asignarSucursal(this.sucursalSeleccionada, this.usuarioSeleccionado).subscribe(
      (usuario: Usuario) => {
        this.cargando = false;
        const indice = this.usuarios.indexOf(this.usuarioSeleccionado);
        this.usuarios.splice(indice, 1);
        this.datosTabla.data = this.usuarios;
        asignarSucursalForm.resetForm();
        this.toastr.success('Se ha asignado exitosamente la sucursal', 'Sucursal asignada', { closeButton: true });
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
