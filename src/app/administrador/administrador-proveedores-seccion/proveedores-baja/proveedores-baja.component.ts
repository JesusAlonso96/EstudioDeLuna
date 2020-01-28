import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';

@Component({
  selector: 'app-proveedores-baja',
  templateUrl: './proveedores-baja.component.html',
  styleUrls: ['./proveedores-baja.component.scss']
})
export class ProveedoresBajaComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'borrar'];
  proveedores: Proveedor[];
  busquedaProveedor: string = '';
  cargando: boolean = false;
  constructor(private dialog: MatDialog, private usuarioService: UsuarioService, private adminService: AdministradorService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedores();
  }
  obtenerProveedores() {
    this.cargando = true;
    this.usuarioService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.cargando = false;
        this.proveedores = proveedores;
        this.inicializarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  confirmarEliminacion(proveedor: Proveedor) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Eliminar proveedor', mensaje: '¿Desea eliminar este proveedor?', msgBoton: 'Eliminar', color: 'warn' }
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.eliminarProveedor(proveedor);
      }
    })
  }
  eliminarProveedor(proveedor: Proveedor) {
    this.cargando = true;
    const indice = this.proveedores.indexOf(proveedor);
    this.adminService.eliminarProveedor(proveedor).subscribe(
      (eliminado) => {
        this.cargando = false;
        this.toastr.success(eliminado.detalles, eliminado.titulo, { closeButton: true });
        this.proveedores.splice(indice, 1);
        this.listData.data = this.proveedores;
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.proveedores);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (proveedor: Proveedor, filtro: string) => {
      return proveedor.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
  aplicarFiltro() {
    this.listData.filter = this.busquedaProveedor.trim().toLowerCase();
  }
  borrarBusqueda() {
    this.busquedaProveedor = '';
    this.aplicarFiltro();
  }

}
