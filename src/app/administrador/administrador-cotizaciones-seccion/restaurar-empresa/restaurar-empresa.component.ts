import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';

@Component({
  selector: 'app-restaurar-empresa',
  templateUrl: './restaurar-empresa.component.html',
  styleUrls: ['./restaurar-empresa.component.scss']
})
export class RestaurarEmpresaComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<EmpresaCot>;
  displayedColumns: string[] = ['nombre', 'contacto', 'email', 'restaurar'];
  busquedaEmpresa: string = '';
  cargando: boolean = false;
  empresasEliminadas: EmpresaCot[] = [];

  constructor(private adminService: AdministradorService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerEmpresasEliminadas();
  }
  obtenerEmpresasEliminadas() {
    this.cargando = true;
    this.adminService.obtenerEmpresasEliminadas().subscribe(
      (empresasEliminadas: EmpresaCot[]) => {
        this.cargando = false;
        this.empresasEliminadas = empresasEliminadas;
        this.inicializarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }

    );
  }
  confirmarRestauracion(empresa: EmpresaCot) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Restaurar empresa', mensaje: '¿Desea restaurar esta empresa?', msgBoton: 'Restaurar', color: 'accent' }
    })
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) this.restaurarEmpresaEliminada(empresa);
    })
  }
  restaurarEmpresaEliminada(empresa: EmpresaCot) {
    this.cargando = true;
    this.adminService.restaurarEmpresa(empresa).subscribe(
      (restaurada: Mensaje) => {
        this.cargando = false;
        this.toastr.success(restaurada.detalles, restaurada.titulo, { closeButton: true });
        this.quitarEmpresaEliminada(empresa);
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  quitarEmpresaEliminada(empresa: EmpresaCot) {
    const indice = this.empresasEliminadas.indexOf(empresa);
    this.empresasEliminadas.splice(indice, 1);
    this.listData.data = this.empresasEliminadas;
  }

  inicializarTabla() {
    this.listData = new MatTableDataSource(this.empresasEliminadas);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (empresa: EmpresaCot, filtro: string) => {
      return empresa.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
  borrarBusqueda() {
    this.busquedaEmpresa = '';
    this.aplicarFiltroBusqueda();
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaEmpresa.trim().toLowerCase();
  }
}
