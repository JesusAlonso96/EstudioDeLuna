import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { Cliente } from '../../modelos/cliente.model';
import { EmpresaCot } from '../../modelos/empresa_cot.model';
import { Proveedor } from '../../modelos/proveedor.model';
import { Usuario } from '../../modelos/usuario.model';
import { BuscadorService } from '../../servicios/buscador.service';
import { Almacen } from '../../modelos/almacen.model';
import { Animaciones } from '../../constantes/animaciones';
import { TipoGastoGeneral } from '../../modelos/tipo_gasto_general.model';
import { TiposDePersona } from '../../enumeraciones/tipos-de-persona.enum';
import { MetodosPago } from '../../enumeraciones/metodos-pago.enum';
import { GastoGeneral } from '../../modelos/gasto_general.model';
import { GastoInsumo } from '../../modelos/gasto_insumo.model';
import { Compra } from '../../modelos/compra.model';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss'],
  animations: [Animaciones.deslizarAbajo]

})
export class BuscadorComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
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
  //tipos de gasto general
  confirmarEdicionTipoGastoGeneral(tipoGastoGeneral: TipoGastoGeneral) {
    this.buscadorService.confirmarEditarTipoGastoGeneral(this.datosTabla, this.elementos, tipoGastoGeneral);
  }
  //gastos generales
  confirmarEdicionGastoGeneral(gastoGeneral: GastoGeneral) {
    this.buscadorService.confirmarEditarGastoGeneral(this.datosTabla, this.elementos, gastoGeneral);
  }
  //gastos de insumos
  confirmarEdicionGastoInsumo(gastoInsumo: GastoInsumo) {
    this.buscadorService.confirmarEditarGastoInsumo(this.datosTabla, this.elementos, gastoInsumo);
  }
  nuevoGastoInsumo(compra: Compra) {
    this.buscadorService.nuevoGastoInsumo(this.datosTabla, this.elementos, compra);
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
  obtenerRazonSocial(tipoGastoGeneral: TipoGastoGeneral): string {
    switch (tipoGastoGeneral.tipoDePersona) {
      case TiposDePersona.Moral: return tipoGastoGeneral.razonSocial;
      case TiposDePersona.Fisica: return tipoGastoGeneral.nombre_persona + ' ' + tipoGastoGeneral.ape_pat_persona + (tipoGastoGeneral.ape_mat_persona ? (' ' + tipoGastoGeneral.ape_mat_persona) : '');
    }
  }
  obtenerMetodoPago(metodoPago: string): string {
    switch (metodoPago) {
      case MetodosPago.Efectivo: return 'Efectivo';
      case MetodosPago.TransferenciaElectronicaDeFondos: return 'Transferencia electrónica de fondos';
    }
  }
}