import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatTab } from '@angular/material';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { EditarProveedorComponent } from 'src/app/comun/componentes/modales/editar-proveedor/editar-proveedor.component';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';

@Component({
  selector: 'app-proveedores-editar',
  templateUrl: './proveedores-editar.component.html',
  styleUrls: ['./proveedores-editar.component.scss']
})
export class ProveedoresEditarComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'editar'];
  proveedores: Proveedor[];
  busquedaProveedor: string = '';
  cargando: boolean = false;
  constructor(public dialog: MatDialog, private usuarioService: UsuarioService,private adminService: AdministradorService, private toastr: ToastrService) { }

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
  abrirEditarProveedor(proveedor: Proveedor) {
    const proveedorAux: Proveedor = Proveedor.prototype.nuevoProveedor(proveedor._id, proveedor.nombre, proveedor.rfc, proveedor.email, proveedor.ciudad, proveedor.estado, proveedor.telefono, proveedor.direccion, proveedor.colonia, proveedor.cp, proveedor.num_ext, proveedor.num_int, proveedor.activo, proveedor.productos);
    const dialogRef = this.dialog.open(EditarProveedorComponent, {
      data: proveedor
    })
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.editarProveedor(proveedor, proveedorAux);
      } else {
        this.restablecerDatosProveedor(proveedor, proveedorAux);
      }
    })
  }
  editarProveedor(proveedor: Proveedor, proveedorAuxiliar: Proveedor) {
    this.cargando = true;
    this.adminService.editarProveedor(proveedor).subscribe(
      (proveedorActualizado: any) => {
        this.cargando = false;
        this.toastr.success(proveedorActualizado.detalles, proveedorActualizado.titulo, { closeButton: true });
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.restablecerDatosProveedor(proveedor, proveedorAuxiliar);
      }
    );
  }
  restablecerDatosProveedor(proveedor: Proveedor, proveedorAuxiliar: Proveedor) {
    const indice = this.proveedores.indexOf(proveedor);
    this.proveedores[indice] = proveedorAuxiliar;
    this.listData.data = this.proveedores;
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.proveedores);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (proveedor: Proveedor, filtro: string) => {
      return proveedor.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaProveedor.trim().toLowerCase();
  }
  borrarBusqueda() {
    this.busquedaProveedor = '';
    this.aplicarFiltroBusqueda();
  }

}
