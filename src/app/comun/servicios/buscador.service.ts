import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CambiarPermisosComponent } from 'src/app/administrador/administrador-usuarios-seccion/usuarios-consulta/cambiar-permisos/cambiar-permisos.component';
import { AdministradorService } from 'src/app/administrador/servicio-administrador/servicio-administrador.service';
import { EditarClienteComponent } from '../componentes/consulta-cliente/editar-cliente/editar-cliente.component';
import { EditarUsuarioComponent } from '../componentes/consulta-usuario/editar-usuario/editar-usuario.component';
import { ModalConfirmacionComponent } from '../componentes/modal-confirmacion/modal-confirmacion.component';
import { EditarProveedorComponent } from '../componentes/modales/editar-proveedor/editar-proveedor.component';
import { Cliente } from '../modelos/cliente.model';
import { Mensaje } from '../modelos/mensaje.model';
import { Proveedor } from '../modelos/proveedor.model';
import { Usuario } from '../modelos/usuario.model';
import { ClienteService } from './cliente.service';
import { EmpresaCot } from '../modelos/empresa_cot.model';
import { UsuarioService } from './usuario.service';
import { EditarEmpresaComponent } from '../componentes/modales/editar-empresa/editar-empresa.component';
import { Familia } from '../modelos/familia.model';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {

  constructor(private dialog: MatDialog, private adminService: AdministradorService, private clienteService: ClienteService, private usuarioService: UsuarioService, private toastr: ToastrService, private _snackBar: MatSnackBar) { }
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
        }
      }
    })
  }
  /*Eliminacion de proveedores */
  private eliminarProveedor(tabla: MatTableDataSource<Proveedor>, listaProveedores: Proveedor[], proveedor: Proveedor) {
    this.abrirSnackBar('Eliminando proveedor...', '');
    const indice = listaProveedores.indexOf(proveedor);
    this.adminService.eliminarProveedor(proveedor).subscribe(
      (eliminado: Mensaje) => {
        this.toastr.success(eliminado.detalles, eliminado.titulo, { closeButton: true });
        this.quitarElementoTabla(tabla, listaProveedores, proveedor);
        this.cerrarSnackBar();
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  /*Eliminacion de clientes */
  private eliminarCliente(tabla: MatTableDataSource<Cliente>, listaClientes: Cliente[], cliente: Cliente) {
    this.abrirSnackBar('Eliminando cliente...', '');
    this.clienteService.eliminarCliente(cliente).subscribe(
      (eliminado: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(eliminado.detalles, eliminado.titulo, { closeButton: true });
        this.quitarElementoTabla(tabla, listaClientes, cliente);
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  /*Eliminacion de usuarios */
  private eliminarUsuario(tabla: MatTableDataSource<Usuario>, listaUsuarios: Usuario[], usuario: Usuario) {
    if (!usuario.ocupado) {
      this.abrirSnackBar('Eliminando usuario...', '');
      this.adminService.eliminarUsuario(usuario).subscribe(
        (eliminado: Mensaje) => {
          this.cerrarSnackBar();
          this.toastr.success(eliminado.detalles, eliminado.titulo, { closeButton: true });
          this.quitarElementoTabla(tabla, listaUsuarios, usuario);
        },
        (err: any) => {
          this.cerrarSnackBar();
          this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        }
      );
    } else {
      this.toastr.info('No se puede eliminar este usuario', 'Usuario ocupado..', { closeButton: true });
    }

  }
  /*Eliminacion de empresas */
  private eliminarEmpresa(tabla: MatTableDataSource<EmpresaCot>, listaEmpresas: EmpresaCot[], empresa: EmpresaCot) {
    this.abrirSnackBar('Eliminando empresa...', '');
    this.usuarioService.eliminarEmpresa(empresa).subscribe(
      (eliminada: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(eliminada.detalles, eliminada.titulo, { closeButton: true });
        this.quitarElementoTabla(tabla, listaEmpresas, empresa);
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
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
        }
      }
    })
  }
  /*Restauracion de proveedores */
  private restaurarProveedorEliminado(tabla: MatTableDataSource<Proveedor>, listaProveedores: Proveedor[], proveedor: Proveedor) {
    this.abrirSnackBar('Restaurando proveedor...', '');
    this.adminService.restaurarProveedor(proveedor).subscribe(
      (restaurado: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(restaurado.detalles, restaurado.titulo, { closeButton: true });
        this.quitarElementoTabla(tabla, listaProveedores, proveedor);
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  /*Restauracion de clientes */
  private restaurarClienteEliminado(tabla: MatTableDataSource<Cliente>, listaClientes: Cliente[], cliente: Cliente) {
    this.abrirSnackBar('Restaurando cliente...', '');
    this.clienteService.restaurarCliente(cliente).subscribe(
      (restaurado: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(restaurado.detalles, restaurado.titulo, { closeButton: true });
        this.quitarElementoTabla(tabla, listaClientes, cliente);
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  /*Restauracion de usuarios */
  private restaurarUsuarioEliminado(tabla: MatTableDataSource<Usuario>, listaUsuarios: Usuario[], usuario: Usuario) {
    this.abrirSnackBar('Restaurando usuario...', '');
    this.adminService.restaurarUsuario(usuario).subscribe(
      (usuarioRestaurado) => {
        this.cerrarSnackBar();
        this.toastr.success(usuarioRestaurado.detalles, usuarioRestaurado.titulo, { closeButton: true });
        this.quitarElementoTabla(tabla, listaUsuarios, usuario);
      },
      (err) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  /*Restauracion de empresas */
  private restaurarEmpresaEliminada(tabla: MatTableDataSource<EmpresaCot>, listaEmpresas: EmpresaCot[], empresa: EmpresaCot) {
    this.abrirSnackBar('Restaurando usuario...', '');
    this.adminService.restaurarEmpresa(empresa).subscribe(
      (usuarioRestaurado) => {
        this.cerrarSnackBar();
        this.toastr.success(usuarioRestaurado.detalles, usuarioRestaurado.titulo, { closeButton: true });
        this.quitarElementoTabla(tabla, listaEmpresas, empresa);
      },
      (err) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  /*Restauracion de familias */
  private restaurarFamiliaEliminada(tabla: MatTableDataSource<Familia>, listaFamilias: Familia[], familia: Familia) {
    this.abrirSnackBar('Restaurando familia...', '');
    this.adminService.restaurarFamilia(familia).subscribe(
      (familiaRestaurada: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(familiaRestaurada.detalles, familiaRestaurada.titulo, { closeButton: true });
        this.quitarElementoTabla(tabla, listaFamilias, familia);
      },
      (err) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
    this.abrirSnackBar('Guardando cambios...', '');
    this.adminService.editarProveedor(proveedor).subscribe(
      (proveedorActualizado: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(proveedorActualizado.detalles, proveedorActualizado.titulo, { closeButton: true });
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
    this.abrirSnackBar('Guardando cambios...', '');
    this.clienteService.editarCliente(cliente).subscribe(
      (actualizado: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(actualizado.detalles, actualizado.titulo, { closeButton: true });
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
    this.abrirSnackBar('Guardado cambios...', '');
    this.adminService.editarUsuario(usuario).subscribe(
      (actualizado: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(actualizado.detalles, actualizado.titulo, { closeButton: true });
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.restablecerDatosElemento(tabla, listaUsuarios, usuario, usuarioAuxiliar);
      }
    );
  }
  public cambiarPermisosUsuario(usuario: Usuario) {
    this.dialog.open(CambiarPermisosComponent, {
      data: usuario
    });
  }
  /*Edicion de usuarios */
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
    this.abrirSnackBar('Guardando cambios...', '');
    this.usuarioService.actualizarEmpresa(empresa).subscribe(
      (actualizada: Mensaje) => {
        this.cerrarSnackBar();
        this.toastr.success(actualizada.detalles, actualizada.titulo, { closeButton: true });
      },
      (err: any) => {
        this.cerrarSnackBar();
        this.toastr.error(err.error.titulo, err.error.detalles, { closeButton: true });
        this.restablecerDatosElemento(tabla, listaEmpresas, empresa, empresaAuxiliar);
      }
    );
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
  //snackbar
  private abrirSnackBar(mensaje: string, accion: string) {
    this._snackBar.open(mensaje, accion, {
      duration: 6000
    });
  }
  private cerrarSnackBar() {
    this._snackBar.dismiss();
  }
}