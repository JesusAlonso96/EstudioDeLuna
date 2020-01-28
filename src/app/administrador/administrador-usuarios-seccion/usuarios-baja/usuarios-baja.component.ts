import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';

@Component({
  selector: 'app-usuarios-baja',
  templateUrl: './usuarios-baja.component.html',
  styleUrls: ['./usuarios-baja.component.scss']
})
export class UsuariosBajaComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'acciones'];
  usuarios: Usuario[];
  busquedaUsuario: string = '';
  cargando: boolean = false;
  cargandoEliminacion: boolean = false;

  constructor(private dialog: MatDialog, private usuarioService: UsuarioService, private adminService: AdministradorService, private toastr: ToastrService, private autService: ServicioAutenticacionService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.cargando = true;
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        this.cargando = false;
        this.usuarios = usuarios;
        this.inicializarTabla();
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaUsuario.trim().toLowerCase();
  }
  borrarBusqueda() {
    this.busquedaUsuario = '';
    this.aplicarFiltroBusqueda();
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.usuarios);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (usuario: Usuario, filtro: string) => {
      return usuario.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
  confirmarEliminacion(usuario: Usuario) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Eliminar usuario', mensaje: '¿Desea eliminar este usuario?', msgBoton: 'Eliminar', color: 'warn' }
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        //eliminar
        if (usuario.ocupado) {
          this.toastr.info('No se puede eliminar el usuario', 'Usuario ocupado', { closeButton: true });
        } else {
          this.eliminarUsuario(usuario);
        }
      }
    })
  }
  eliminarUsuario(usuario: Usuario) {
    this.cargandoEliminacion = true;
    const indice = this.usuarios.indexOf(usuario);
    this.adminService.eliminarUsuario(<string>usuario._id).subscribe(
      (eliminado) => {
        this.cargandoEliminacion = false;
        this.toastr.success(eliminado.detalles, eliminado.titulo, { closeButton: true });
        this.usuarios.splice(indice, 1);
        this.listData.data = this.usuarios;
      },
      (err) => {
        this.cargandoEliminacion = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  propiaCuenta(usuario: Usuario): boolean {
    if (this.autService.getNombreUsuario() == usuario.nombre) return true;
    return false;
  }
}
