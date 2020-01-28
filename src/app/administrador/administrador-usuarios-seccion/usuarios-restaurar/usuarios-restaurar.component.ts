import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-usuarios-restaurar',
  templateUrl: './usuarios-restaurar.component.html',
  styleUrls: ['./usuarios-restaurar.component.scss']
})
export class UsuariosRestaurarComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<Usuario>;
  displayedColumns: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'restaurar'];
  busquedaUsuario: string = '';
  cargando: boolean = false;
  usuariosEliminados: Usuario[] = [];

  constructor(private adminService: AdministradorService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerUsuariosEliminados();
  }
  obtenerUsuariosEliminados() {
    this.cargando = true;
    this.adminService.obtenerUsuariosEliminados().subscribe(
      (usuariosEliminados: Usuario[]) => {
        this.cargando = false;
        this.usuariosEliminados = usuariosEliminados;
        this.inicializarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  confirmarRestauracion(usuario: Usuario) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Restaurar usuario', mensaje: '¿Desea restaurar al usuario?', msgBoton: 'Restaurar', color: 'accent' }
    })
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) this.restaurarUsuarioEliminado(usuario);
    })
  }
  restaurarUsuarioEliminado(usuario: Usuario) {
    this.cargando = true;
    this.adminService.restaurarUsuario(usuario).subscribe(
      (usuarioRestaurado) => {
        this.cargando = false;
        this.toastr.success(usuarioRestaurado.detalles, usuarioRestaurado.titulo, { closeButton: true });
        this.quitarUsuarioEliminado(usuario);
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  quitarUsuarioEliminado(usuario: Usuario) {
    const indice = this.usuariosEliminados.indexOf(usuario);
    this.usuariosEliminados.splice(indice, 1);
    this.listData.data = this.usuariosEliminados;
  }
  borrarBusqueda() {
    this.busquedaUsuario = '';
    this.aplicarFiltroBusqueda();
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaUsuario.trim().toLowerCase();
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.usuariosEliminados);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (usuario: Usuario, filtro: string) => {
      return usuario.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }

}
