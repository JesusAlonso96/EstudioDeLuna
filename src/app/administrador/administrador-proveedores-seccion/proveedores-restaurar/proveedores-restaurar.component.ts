import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-proveedores-restaurar',
  templateUrl: './proveedores-restaurar.component.html',
  styleUrls: ['./proveedores-restaurar.component.scss']
})
export class ProveedoresRestaurarComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'restaurar'];
  proveedores: Proveedor[];
  cargando: boolean = false;
  busquedaProveedor: string = '';

  constructor(private dialog: MatDialog, private adminService: AdministradorService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedoresEliminados();
  }

  obtenerProveedoresEliminados() {
    this.cargando = true;
    this.adminService.obtenerProveedoresEliminados().subscribe(
      (proveedoresEliminados: Proveedor[]) => {
        this.cargando = false;
        this.proveedores = proveedoresEliminados;
        this.inicializarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  confirmarRestauracion(proveedor: Proveedor) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Restaurar proveedor', mensaje: '¿Desea restaurar al proveedor?', msgBoton: 'Restaurar', color: 'accent' }
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) this.restaurarProveedorEliminado(proveedor);
    })
  }
  restaurarProveedorEliminado(proveedor: Proveedor) {
    this.cargando = true;
    this.adminService.restaurarProveedor(proveedor).subscribe(
      (proveedorRestaurado: any) => {
        this.cargando = false;
        this.toastr.success(proveedorRestaurado.detalles, proveedorRestaurado.titulo, { closeButton: true });
        this.quitarProveedorEliminado(proveedor);
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  quitarProveedorEliminado(proveedor: Proveedor) {
    const indice = this.proveedores.indexOf(proveedor);
    this.proveedores.splice(indice, 1);
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
  borrarBusqueda() {
    this.busquedaProveedor = '';
    this.aplicarFiltroBusqueda();
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaProveedor.trim().toLowerCase();
  }
}
