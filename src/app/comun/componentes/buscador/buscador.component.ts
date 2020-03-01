import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Cliente } from '../../modelos/cliente.model';
import { EmpresaCot } from '../../modelos/empresa_cot.model';
import { Proveedor } from '../../modelos/proveedor.model';
import { Usuario } from '../../modelos/usuario.model';
import { BuscadorService } from '../../servicios/buscador.service';
import { Almacen } from '../../modelos/almacen.model';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss'],
  providers: []

})
export class BuscadorComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @Input() elementos: any[];
  @Input() columnas: string[];
  @Input() nombre: string;
  @Input() accion: string;
  busquedaElemento: string = '';
  datosTabla: MatTableDataSource<any>;
  cargando: boolean = false;

  constructor(private buscadorService: BuscadorService, private autService: ServicioAutenticacionService) { }

  ngOnInit() {
    this.inicializarTabla();
  }
  ngAfterViewInit() {
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.sort = this.sort;
  }
  inicializarTabla() {
    this.datosTabla = new MatTableDataSource(this.elementos);
    this.datosTabla.paginator = this.paginator;
    this.datosTabla.filterPredicate = (elemento: any, filtro: string) => {
      return elemento.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
  aplicarFiltroBusqueda() {
    this.datosTabla.filter = this.busquedaElemento.trim().toLowerCase();
  }
  borrarBusqueda() {
    this.busquedaElemento = '';
    this.aplicarFiltroBusqueda();
  }
  //proveedores
  confirmarEdicionProveedor(proveedor: Proveedor) {
    this.buscadorService.confirmarEditarProveedor(this.datosTabla, this.elementos, proveedor);
  }
  //clientes
  confirmarEdicionCliente(cliente: Cliente) {
    this.buscadorService.confirmarEditarCliente(this.datosTabla, this.elementos, cliente);
  }
  //usuarios
  confirmarEdicionUsuario(usuario: Usuario) {
    this.buscadorService.confirmarEditarUsuario(this.datosTabla, this.elementos, usuario);
  }
  cambiarPermisosUsuario(usuario: Usuario) {
    this.buscadorService.cambiarPermisosUsuario(usuario);
  }
  //empresas
  confirmarEdicionEmpresa(empresa: EmpresaCot) {
    this.buscadorService.confirmarEditarEmpresa(this.datosTabla, this.elementos, empresa);
  }
  //almacenes
  confirmarEdicionAlmacen(almacen: Almacen) {
    this.buscadorService.confirmarEditarAlmacen(this.datosTabla, this.elementos, almacen);
  }
  //Funcion general para restaurar cualquier elemento
  confirmarRestauracionElemento(elemento: any, nombre: string, tipo: number) {
    this.buscadorService.confirmarRestauracionElemento(this.datosTabla, this.elementos, elemento, nombre, tipo);
  }
  //Funcion general para eliminar cualquier elemento
  confirmarEliminacionElemento(elemento: any, nombre: string, tipo: number) {
    this.buscadorService.confirmarEliminacionElemento(this.datosTabla, this.elementos, elemento, nombre, tipo);
  }
  //funciones auxiliares
  propiaCuenta(usuario: Usuario): boolean {
    return this.autService.getIdUsuario() == usuario._id ? true : false;
  }
  esAdministrador(): boolean {
    return this.autService.getTipoUsuario() == 2 ? true : false;
  }
}