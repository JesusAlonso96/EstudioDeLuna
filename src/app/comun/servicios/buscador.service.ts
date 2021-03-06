import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { CambiarPermisosComponent } from 'src/app/administrador/administrador-usuarios-seccion/usuarios-consulta/cambiar-permisos/cambiar-permisos.component';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import { EditarClienteComponent } from '../componentes/consulta-cliente/editar-cliente/editar-cliente.component';
import { EditarUsuarioComponent } from '../componentes/consulta-usuario/editar-usuario/editar-usuario.component';
import { ModalConfirmacionComponent } from '../componentes/modal-confirmacion/modal-confirmacion.component';
import { EditarAlmacenComponent } from '../componentes/modales/editar-almacen/editar-almacen.component';
import { EditarEmpresaComponent } from '../componentes/modales/editar-empresa/editar-empresa.component';
import { EditarProveedorComponent } from '../componentes/modales/editar-proveedor/editar-proveedor.component';
import { Almacen } from '../modelos/almacen.model';
import { Caja } from '../modelos/caja.model';
import { Cliente } from '../modelos/cliente.model';
import { EmpresaCot } from '../modelos/empresa_cot.model';
import { Familia } from '../modelos/familia.model';
import { Mensaje } from '../modelos/mensaje.model';
import { Proveedor } from '../modelos/proveedor.model';
import { Usuario } from '../modelos/usuario.model';
import { AlmacenService } from './almacen.service';
import { CajaService } from './caja.service';
import { ClienteService } from './cliente.service';
import { NgToastrService } from './ng-toastr.service';
import { UsuarioService } from './usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProveedoresService } from './proveedores.service';
import { CotizacionesService } from './cotizaciones.service';
import { CargandoService } from './cargando.service';
import { TipoGastoGeneral } from '../modelos/tipo_gasto_general.model';
import { EditarTipoGastoGeneralComponent } from '../componentes/modales/editar-tipo-gasto-general/editar-tipo-gasto-general.component';
import { TipoGastoGeneralService } from './tipo-gasto-general.service';
import { GastoGeneralService } from './gasto-general.service';
import { GastoGeneral } from '../modelos/gasto_general.model';
import { EditarGastoGeneralComponent } from '../componentes/modales/editar-gasto-general/editar-gasto-general.component';
import { GastoInsumo } from '../modelos/gasto_insumo.model';
import { EditarGastoInsumoComponent } from '../componentes/modales/editar-gasto-insumo/editar-gasto-insumo.component';
import { GastoInsumoService } from './gasto-insumo.service';
import { Compra } from '../modelos/compra.model';
import { AltaGastoInsumoComponent } from '../componentes/modales/alta-gasto-insumo/alta-gasto-insumo.component';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {

  constructor(private dialog: MatDialog,
    private adminService: AdministradorService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private toastr: NgToastrService,
    private almacenService: AlmacenService,
    private _snackBar: MatSnackBar,
    private cajaService: CajaService,
    private proveedoresService: ProveedoresService,
    private cotizacionesService: CotizacionesService,
    private tipoGastoGeneralService: TipoGastoGeneralService,
    private gastoGeneralService: GastoGeneralService,
    private cargandoService: CargandoService,
    private gastoInsumoService: GastoInsumoService) { }
  //eliminaciones
  public confirmarEliminacionElemento(tabla: MatTableDataSource<any>, listaElementos: any[], elemento: any, nombre: string, tipo: number) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: `Eliminar ${nombre}`, mensaje: `¿Desea eliminar este ${nombre}?`, msgBoton: 'Eliminar', color: 'warn' }
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        switch (tipo) {
          case 0: this.eliminarProveedor(tabla, listaElementos, elemento); break;
          case 1: this.eliminarCliente(tabla, listaElementos, elemento); break;
          case 2: this.eliminarUsuario(tabla, listaElementos, elemento); break;
          case 3: this.eliminarEmpresa(tabla, listaElementos, elemento); break;
          case 4: this.eliminarAlmacen(tabla, listaElementos, elemento); break;
          case 5: this.eliminarCaja(tabla, listaElementos, elemento); break;
          case 6: this.eliminarTipoGastoGeneral(tabla, listaElementos, elemento); break;
          case 7: this.eliminarGastoGeneral(tabla, listaElementos, elemento); break;
          //case 8: this.eliminarGastoInsumo(tabla, listaElementos, elemento); break;
        }
      }
    })
  }
  /*Eliminacion de proveedores */
  private eliminarProveedor(tabla: MatTableDataSource<Proveedor>, listaProveedores: Proveedor[], proveedor: Proveedor) {
    this.cargandoService.crearVistaCargando(true, 'Eliminando proveedor');
    const indice = listaProveedores.indexOf(proveedor);
    this.proveedoresService.eliminarProveedor(proveedor).subscribe(
      (eliminado: Mensaje) => {
        this.toastr.abrirToastr('exito', eliminado.titulo, eliminado.detalles);
        this.quitarElementoTabla(tabla, listaProveedores, proveedor);
        this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  /*Eliminacion de clientes */
  private eliminarCliente(tabla: MatTableDataSource<Cliente>, listaClientes: Cliente[], cliente: Cliente) {
    this.cargandoService.crearVistaCargando(true, 'Eliminando cliente');
    this.clienteService.eliminarCliente(cliente).subscribe(
      (eliminado: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', eliminado.titulo, eliminado.detalles);
        this.quitarElementoTabla(tabla, listaClientes, cliente);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  /*Eliminacion de usuarios */
  private eliminarUsuario(tabla: MatTableDataSource<Usuario>, listaUsuarios: Usuario[], usuario: Usuario) {
    if (!usuario.ocupado) {
      this.cargandoService.crearVistaCargando(true, 'Eliminar usuario');
      this.adminService.eliminarUsuario(usuario).subscribe(
        (eliminado: Mensaje) => {
          this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('exito', eliminado.titulo, eliminado.detalles);
          this.quitarElementoTabla(tabla, listaUsuarios, usuario);
        },
        (err: HttpErrorResponse) => {
          this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        }
      );
    } else {
      this.toastr.abrirToastr('info', 'Usuario ocupado..', 'No se puede eliminar este usuario');
    }

  }
  /*Eliminacion de empresas */
  private eliminarEmpresa(tabla: MatTableDataSource<EmpresaCot>, listaEmpresas: EmpresaCot[], empresa: EmpresaCot) {
    this.cargandoService.crearVistaCargando(true, 'Eliminando empresa');
    this.cotizacionesService.eliminarEmpresa(empresa).subscribe(
      (eliminada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', eliminada.titulo, eliminada.detalles);
        this.quitarElementoTabla(tabla, listaEmpresas, empresa);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  /*Eliminacion de almacenes */
  private eliminarAlmacen(tabla: MatTableDataSource<Almacen>, listaAlmacenes: Almacen[], almacen: Almacen) {
    this.cargandoService.crearVistaCargando(true, 'Eliminando almacen');
    this.almacenService.eliminarAlmacen(almacen._id).subscribe(
      (eliminada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', eliminada.detalles, eliminada.titulo);
        this.quitarElementoTabla(tabla, listaAlmacenes, almacen);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      });
  }
  /*Eliminacion de cajas */
  private eliminarCaja(tabla: MatTableDataSource<Caja>, listaCajas: Caja[], caja: Caja) {
    this.cargandoService.crearVistaCargando(true, 'Eliminando caja');
    this.cajaService.eliminarCaja(caja).subscribe(
      (eliminada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', eliminada.detalles, eliminada.titulo);
        this.quitarElementoTabla(tabla, listaCajas, caja);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      });
  }
  /*Eliminacion de tipo de gasto general */
  private eliminarTipoGastoGeneral(tabla: MatTableDataSource<TipoGastoGeneral>, listaTiposGastoGeneral: TipoGastoGeneral[], tipoGastoGeneral: TipoGastoGeneral) {
    this.cargandoService.crearVistaCargando(true,'Eliminando gasto')
    this.tipoGastoGeneralService.eliminarTipoGastoGeneral(tipoGastoGeneral._id).subscribe(
      (eliminada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false)
        this.toastr.abrirToastr('exito', eliminada.detalles, eliminada.titulo);
        this.quitarElementoTabla(tabla, listaTiposGastoGeneral, tipoGastoGeneral);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false)
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      });
  }
  /*Eliminacion de gasto general */
  private eliminarGastoGeneral(tabla: MatTableDataSource<GastoGeneral>, listaGastosGenerales: GastoGeneral[], gastoGeneral: GastoGeneral) {
    this.cargandoService.crearVistaCargando(true,'Eliminando gasto general')
    this.gastoGeneralService.eliminarGastoGeneral(gastoGeneral._id).subscribe(
      (eliminada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false)
        this.toastr.abrirToastr('exito', eliminada.detalles, eliminada.titulo);
        this.quitarElementoTabla(tabla, listaGastosGenerales, gastoGeneral);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      });
  }
  /*Eliminacion de gasto de insumos */
  /*private eliminarGastoInsumo(tabla: MatTableDataSource<GastoInsumo>, listaGastosInsumos: GastoInsumo[], gastoInsumo: GastoInsumo) {
    this.abrirSnackBar('Eliminando gasto general...', '');
    this.gastoInsumoService.eliminarGastoInsumo(gastoInsumo._id).subscribe(
      (eliminada: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.abrirToastr('exito', eliminada.detalles, eliminada.titulo);
        this.quitarElementoTabla(tabla, listaGastosInsumos, gastoInsumo);
      },
      (err: HttpErrorResponse) => {
        this.cerrarSnackBar();
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      });
  }*/
  //restauraciones
  public confirmarRestauracionElemento(tabla: MatTableDataSource<any>, listaElementos: any[], elemento: any, nombre: string, tipo: number) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: `Restaurar ${nombre}`, mensaje: `¿Desea restaurar este ${nombre}?`, msgBoton: 'Restaurar', color: 'accent' }
    })
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        switch (tipo) {
          case 0: this.restaurarProveedorEliminado(tabla, listaElementos, elemento); break;
          case 1: this.restaurarClienteEliminado(tabla, listaElementos, elemento); break;
          case 2: this.restaurarUsuarioEliminado(tabla, listaElementos, elemento); break;
          case 3: this.restaurarEmpresaEliminada(tabla, listaElementos, elemento); break;
          case 4: this.restaurarFamiliaEliminada(tabla, listaElementos, elemento); break;
          case 5: this.restaurarAlmacenEliminado(tabla, listaElementos, elemento); break;
          case 6: this.restaurarCajaEliminada(tabla, listaElementos, elemento); break;
        }
      }
    })
  }
  /*Restauracion de proveedores */
  private restaurarProveedorEliminado(tabla: MatTableDataSource<Proveedor>, listaProveedores: Proveedor[], proveedor: Proveedor) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando proveedor');
    this.proveedoresService.restaurarProveedor(proveedor).subscribe(
      (restaurado: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', restaurado.titulo, restaurado.detalles);
        this.quitarElementoTabla(tabla, listaProveedores, proveedor);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  /*Restauracion de clientes */
  private restaurarClienteEliminado(tabla: MatTableDataSource<Cliente>, listaClientes: Cliente[], cliente: Cliente) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando cliente');
    this.clienteService.restaurarCliente(cliente).subscribe(
      (restaurado: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', restaurado.titulo, restaurado.detalles);
        this.quitarElementoTabla(tabla, listaClientes, cliente);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  /*Restauracion de usuarios */
  private restaurarUsuarioEliminado(tabla: MatTableDataSource<Usuario>, listaUsuarios: Usuario[], usuario: Usuario) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando usuario');
    this.adminService.restaurarUsuario(usuario).subscribe(
      (restaurado: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', restaurado.titulo, restaurado.detalles);
        this.quitarElementoTabla(tabla, listaUsuarios, usuario);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  /*Restauracion de empresas */
  private restaurarEmpresaEliminada(tabla: MatTableDataSource<EmpresaCot>, listaEmpresas: EmpresaCot[], empresa: EmpresaCot) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando empresa');
    this.adminService.restaurarEmpresa(empresa).subscribe(
      (restaurado: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', restaurado.titulo, restaurado.detalles);
        this.quitarElementoTabla(tabla, listaEmpresas, empresa);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  /*Restauracion de familias */
  private restaurarFamiliaEliminada(tabla: MatTableDataSource<Familia>, listaFamilias: Familia[], familia: Familia) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando familia');
    this.adminService.restaurarFamilia(familia).subscribe(
      (restaurada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', restaurada.titulo, restaurada.detalles);
        this.quitarElementoTabla(tabla, listaFamilias, familia);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );

  }
  /*Restauracion de almacenes */
  private restaurarAlmacenEliminado(tabla: MatTableDataSource<Almacen>, listaAlmacenes: Almacen[], almacen: Almacen) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando almacen');
    this.almacenService.restaurarAlmacen(almacen._id).subscribe(
      (restaurada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', restaurada.titulo, restaurada.detalles);
        this.quitarElementoTabla(tabla, listaAlmacenes, almacen);
      },
      (err) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  /*Restauracion de almacenes */
  private restaurarCajaEliminada(tabla: MatTableDataSource<Caja>, listaCajas: Caja[], caja: Caja) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando caja');
    this.cajaService.restaurarCaja(caja).subscribe(
      (restaurada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', restaurada.titulo, restaurada.detalles);
        this.quitarElementoTabla(tabla, listaCajas, caja);
      },
      (err) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  //editar
  /*Edicion de proveedores */
  public confirmarEditarProveedor(tabla: MatTableDataSource<Proveedor>, listaProveedores: Proveedor[], proveedor: Proveedor) {
    const proveedorAux: Proveedor = Proveedor.prototype.nuevoProveedor(proveedor._id, proveedor.nombre, proveedor.rfc, proveedor.email, proveedor.ciudad, proveedor.estado, proveedor.telefono, proveedor.direccion, proveedor.colonia, proveedor.cp, proveedor.num_ext, proveedor.num_int, proveedor.activo, proveedor.productos);
    const dialogRef = this.dialog.open(EditarProveedorComponent, {
      data: proveedor
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.editarProveedor(tabla, listaProveedores, proveedor, proveedorAux);
      } else {
        this.restablecerDatosElemento(tabla, listaProveedores, proveedor, proveedorAux);
      }
    })
  }
  private editarProveedor(tabla: MatTableDataSource<Proveedor>, listaProveedores: Proveedor[], proveedor: Proveedor, proveedorAuxiliar: Proveedor) {
    this.cargandoService.crearVistaCargando(true, 'Actualizando proveedor');
    this.proveedoresService.editarProveedor(proveedor).subscribe(
      (actualizado: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', actualizado.titulo, actualizado.detalles);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.restablecerDatosElemento(tabla, listaProveedores, proveedor, proveedorAuxiliar);
      }
    );
  }
  /*Edicion de clientes */
  public confirmarEditarCliente(tabla: MatTableDataSource<Cliente>, listaClientes: Cliente[], cliente: Cliente) {
    const clienteAux = new Cliente(cliente._id, cliente.nombre, cliente.username, cliente.ape_pat, cliente.ape_mat, cliente.email, cliente.telefono, cliente.contrasena, cliente.razonSocial, cliente.rfc, cliente.direccion, cliente.colonia, cliente.municipio, cliente.estado, cliente.cp, cliente.num_ext, cliente.num_int, cliente.pedidos, cliente.fecha_registro, cliente.activo);
    const dialogRef = this.dialog.open(EditarClienteComponent, { data: cliente });
    dialogRef.afterClosed().subscribe(editar => {
      if (editar) {
        this.editarCliente(tabla, listaClientes, cliente, clienteAux);
      } else {
        this.restablecerDatosElemento(tabla, listaClientes, cliente, clienteAux);
      }
    });
  }
  private editarCliente(tabla: MatTableDataSource<Cliente>, listaClientes: Cliente[], cliente: Cliente, clienteAuxiliar: Cliente) {
    this.cargandoService.crearVistaCargando(true, 'Actualizando cliente');
    this.clienteService.editarCliente(cliente).subscribe(
      (actualizado: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', actualizado.titulo, actualizado.detalles);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.restablecerDatosElemento(tabla, listaClientes, cliente, clienteAuxiliar);
      }
    );
  }
  /*Edicion de usuarios */
  public confirmarEditarUsuario(tabla: MatTableDataSource<Usuario>, listaUsuarios: Usuario[], usuario: Usuario) {
    const usuarioAux: Usuario = new Usuario(usuario._id, usuario.nombre, usuario.username, usuario.ape_pat, usuario.ape_mat, usuario.email, usuario.telefono, usuario.rol, usuario.rol_sec, usuario.ocupado, usuario.asistencia, usuario.pedidosTomados, usuario.activo);
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      data: usuario
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.editarUsuario(tabla, listaUsuarios, usuario, usuarioAux);
      } else {
        this.restablecerDatosElemento(tabla, listaUsuarios, usuario, usuarioAux);
      }
    })
  }
  private editarUsuario(tabla: MatTableDataSource<Usuario>, listaUsuarios: Usuario[], usuario: Usuario, usuarioAuxiliar: Usuario) {
    this.cargandoService.crearVistaCargando(true, 'Actualizando usuario');
    this.adminService.editarUsuario(usuario).subscribe(
      (actualizado: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', actualizado.titulo, actualizado.detalles);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.restablecerDatosElemento(tabla, listaUsuarios, usuario, usuarioAuxiliar);
      }
    );
  }
  public cambiarPermisosUsuario(usuario: Usuario) {
    this.dialog.open(CambiarPermisosComponent, {
      data: usuario
    });
  }
  /*Edicion de empresas */
  public confirmarEditarEmpresa(tabla: MatTableDataSource<EmpresaCot>, listaEmpresas: EmpresaCot[], empresa: EmpresaCot) {
    const empresaAux: EmpresaCot = EmpresaCot.prototype.nuevaEmpresa(empresa._id, empresa.nombre, empresa.direccion, empresa.contacto, empresa.telefono, empresa.email, empresa.activa);
    const dialogRef = this.dialog.open(EditarEmpresaComponent, { data: empresa });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.editarEmpresa(tabla, listaEmpresas, empresa, empresaAux);
      } else {
        this.restablecerDatosElemento(tabla, listaEmpresas, empresa, empresaAux);
      }
    }
    );
  }
  private editarEmpresa(tabla: MatTableDataSource<EmpresaCot>, listaEmpresas: EmpresaCot[], empresa: EmpresaCot, empresaAuxiliar: EmpresaCot) {
    this.cargandoService.crearVistaCargando(true, 'Actualizando empresa');
    this.cotizacionesService.actualizarEmpresa(empresa).subscribe(
      (actualizada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', actualizada.titulo, actualizada.detalles);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.restablecerDatosElemento(tabla, listaEmpresas, empresa, empresaAuxiliar);
      }
    );
  }
  /*Edicion de almacenes */
  public confirmarEditarAlmacen(tabla: MatTableDataSource<Almacen>, listaAlmacenes: Almacen[], almacen: Almacen) {
    const almacenAux: Almacen = Almacen.prototype.nuevoAlmacen(almacen._id, almacen.id, almacen.nombre, almacen.direccion.calle, almacen.direccion.colonia, almacen.direccion.num_ext, almacen.direccion.num_int, almacen.direccion.cp, almacen.direccion.ciudad, almacen.direccion.estado);
    const dialogRef = this.dialog.open(EditarAlmacenComponent, { data: almacen });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.editarAlmacen(tabla, listaAlmacenes, almacen, almacenAux);
      } else {
        this.restablecerDatosElemento(tabla, listaAlmacenes, almacen, almacenAux);
      }
    }
    );
  }
  private editarAlmacen(tabla: MatTableDataSource<Almacen>, listaAlmacenes: Almacen[], almacen: Almacen, almacenAuxiliar: Almacen) {
    this.cargandoService.crearVistaCargando(true, 'Actualizando almacen');
    this.almacenService.actualizarAlmacen(almacen, almacen._id).subscribe(
      (actualizada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', actualizada.titulo, actualizada.detalles);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.restablecerDatosElemento(tabla, listaAlmacenes, almacen, almacenAuxiliar);
      }
    );

  }
  /*Edicion de tipo de gasto general */
  public confirmarEditarTipoGastoGeneral(tabla: MatTableDataSource<TipoGastoGeneral>, listaTiposGastoGeneral: TipoGastoGeneral[], tipoGastoGeneral: TipoGastoGeneral) {
    const tipoGastoGeneralAux: TipoGastoGeneral = TipoGastoGeneral.prototype.nuevoTipoGastoGeneral(tipoGastoGeneral._id, tipoGastoGeneral.id, tipoGastoGeneral.nombre, tipoGastoGeneral.descripcion, tipoGastoGeneral.tipoDePersona, tipoGastoGeneral.nombre_persona, tipoGastoGeneral.ape_pat_persona, tipoGastoGeneral.ape_mat_persona, tipoGastoGeneral.razonSocial, tipoGastoGeneral.rfc);
    const dialogRef = this.dialog.open(EditarTipoGastoGeneralComponent, { width: '50%', data: tipoGastoGeneral });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.editarTipoGastoGeneral(tabla, listaTiposGastoGeneral, tipoGastoGeneral, tipoGastoGeneralAux);
      } else {
        this.restablecerDatosElemento(tabla, listaTiposGastoGeneral, tipoGastoGeneral, tipoGastoGeneralAux);
      }
    }
    );
  }
  private editarTipoGastoGeneral(tabla: MatTableDataSource<TipoGastoGeneral>, listaTiposGastoGeneral: TipoGastoGeneral[], tipoGastoGeneral: TipoGastoGeneral, tipoGastoGeneralAux: TipoGastoGeneral) {
    this.cargandoService.crearVistaCargando(true,'Guardando cambios')
    tipoGastoGeneral.rfc = tipoGastoGeneral.rfc.toUpperCase();
    this.tipoGastoGeneralService.actualizarTipoGastoGeneral(tipoGastoGeneral, tipoGastoGeneral._id).subscribe(
      (actualizada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', actualizada.titulo, actualizada.detalles);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.restablecerDatosElemento(tabla, listaTiposGastoGeneral, tipoGastoGeneral, tipoGastoGeneralAux);
      }
    );
  }
  /*Edicion de gasto general */
  public confirmarEditarGastoGeneral(tabla: MatTableDataSource<GastoGeneral>, listaGastosGenerales: GastoGeneral[], gastoGeneral: GastoGeneral) {
    const gastoGeneralAux: GastoGeneral = GastoGeneral.prototype.nuevoGastoGeneral(gastoGeneral._id, gastoGeneral.id, gastoGeneral.tipoGastoGeneral, gastoGeneral.metodoPago, gastoGeneral.nombre, gastoGeneral.razonSocial, gastoGeneral.rfc, gastoGeneral.subtotal, gastoGeneral.ieps, gastoGeneral.porcentajeIva, gastoGeneral.iva, gastoGeneral.total, gastoGeneral.observaciones);
    const dialogRef = this.dialog.open(EditarGastoGeneralComponent, { width: '50%', data: gastoGeneral });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.editarGastoGeneral(tabla, listaGastosGenerales, gastoGeneral, gastoGeneralAux);
      } else {
        this.restablecerDatosElemento(tabla, listaGastosGenerales, gastoGeneral, gastoGeneralAux);
      }
    }
    );
  }
  private editarGastoGeneral(tabla: MatTableDataSource<GastoGeneral>, listaGastosGenerales: GastoGeneral[], gastoGeneral: GastoGeneral, gastoGeneralAux: GastoGeneral) {
    this.cargandoService.crearVistaCargando(true,'Guardando cambios')
    this.gastoGeneralService.actualizarGastoGeneral(gastoGeneral, gastoGeneral._id).subscribe(
      (actualizada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', actualizada.titulo, actualizada.detalles);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.restablecerDatosElemento(tabla, listaGastosGenerales, gastoGeneral, gastoGeneralAux);
      }
    );
  }
  /*Edicion de gasto de insumos */
  public confirmarEditarGastoInsumo(tabla: MatTableDataSource<GastoInsumo>, listaGastosInsumos: GastoInsumo[], gastoInsumo: GastoInsumo) {
    const gastoInsumoAux: GastoInsumo = 
    GastoInsumo.prototype.nuevoGastoInsumo(gastoInsumo._id, gastoInsumo.id, gastoInsumo.compra, gastoInsumo.razonSocial, gastoInsumo.rfc, gastoInsumo.observaciones);
    const dialogRef = this.dialog.open(EditarGastoInsumoComponent, { width: '50%', data: gastoInsumo });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.editarGastoInsumo(tabla, listaGastosInsumos, gastoInsumo, gastoInsumoAux);
      } else {
        this.restablecerDatosElemento(tabla, listaGastosInsumos, gastoInsumo, gastoInsumoAux);
      }
    }
    );
  }
  private editarGastoInsumo(tabla: MatTableDataSource<GastoInsumo>, listaGastosInsumos: GastoInsumo[], gastoInsumo: GastoInsumo, gastoInsumoAux: GastoInsumo) {
    this.cargandoService.crearVistaCargando(true,'Guardando cambios')
    this.gastoInsumoService.actualizarGastoInsumo(gastoInsumo, gastoInsumo._id).subscribe(
      (actualizada: Mensaje) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', actualizada.titulo, actualizada.detalles);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.restablecerDatosElemento(tabla, listaGastosInsumos, gastoInsumo, gastoInsumoAux);
      }
    );
  }
  /*Alta de un gasto de insumo*/
  public nuevoGastoInsumo(tabla: MatTableDataSource<Compra>, listaCompras: Compra[], compra: Compra) {
    const dialogRef = this.dialog.open(AltaGastoInsumoComponent, {
      data: compra,
      width: '50%'
    });
    dialogRef.afterClosed().subscribe(gastoInsumo => {
      if (gastoInsumo) {
        this.agregarGastoInsumo(gastoInsumo, tabla, listaCompras, compra);
      }
    })
  }

  private agregarGastoInsumo(gastoInsumo: GastoInsumo, tabla: MatTableDataSource<Compra>, listaCompras: Compra[], compra: Compra) {
    this.cargandoService.crearVistaCargando(true,'Registrando gasto de insumo');
    this.gastoInsumoService.nuevoGastoInsumo(gastoInsumo).subscribe(
      (gastoInsumo: GastoInsumo) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito',`Se ha registrado exitosamente el gasto de insumos ${gastoInsumo.id}`, 'Gasto de insumos agregado exitosamente');
        this.quitarElementoTabla(tabla, listaCompras, compra);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }

  //auxiliares
  private quitarElementoTabla(tabla: MatTableDataSource<any>, listaElementos: any[], elemento: any) {
    const indice = listaElementos.indexOf(elemento);
    listaElementos.splice(indice, 1);
    tabla.data = listaElementos;
  }
  private restablecerDatosElemento(tabla: MatTableDataSource<any>, listaElementos: any[], elemento: any, elementoAuxiliar: any) {
    const indice = listaElementos.indexOf(elemento);
    listaElementos[indice] = elementoAuxiliar;
    tabla.data = listaElementos;
  }

}