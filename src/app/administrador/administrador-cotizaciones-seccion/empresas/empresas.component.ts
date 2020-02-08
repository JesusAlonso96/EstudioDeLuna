import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { AltaEmpresaComponent } from 'src/app/comun/componentes/modales/alta-empresa/alta-empresa.component';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { EditarEmpresaComponent } from 'src/app/comun/componentes/modales/editar-empresa/editar-empresa.component';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<EmpresaCot>;
  displayedColumns: string[] = ['nombre', 'contacto', 'email', 'editar', 'eliminar'];
  empresas: EmpresaCot[] = [];
  busquedaEmpresa: string = '';
  cargando: boolean = false;
  constructor(private dialog: MatDialog, private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerEmpresas();
  }

  obtenerEmpresas() {
    this.cargando = true;
    this.usuarioService.obtenerEmpresas().subscribe(
      (empresas: EmpresaCot[]) => {
        this.cargando = false;
        this.empresas = empresas;
        this.inicializarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  nuevaEmpresa() {
    const dialogRef = this.dialog.open(AltaEmpresaComponent);
    dialogRef.afterClosed().subscribe(empresa => {
      if (empresa) {
        this.agregarEmpresa(empresa);
      }
    })
  }
  agregarEmpresa(empresa: EmpresaCot) {
    this.cargando = true;
    this.usuarioService.agregarEmpresa(empresa).subscribe(
      (agregada: Mensaje) => {
        this.cargando = false;
        this.toastr.success(agregada.detalles, agregada.detalles, { closeButton: true });
        this.empresas.push(empresa);
        this.reiniciarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  //eliminar empresa
  abrirEliminacion(empresa: EmpresaCot) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Eliminar empresa', mensaje: '¿Desea eliminar esta empresa?', msgBoton: 'Eliminar', color: 'warn' }
    })
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.eliminarEmpresa(empresa);
      }
    })
  }
  eliminarEmpresa(empresa: EmpresaCot) {
    const indice = this.empresas.indexOf(empresa);
    this.cargando = true;
    this.usuarioService.eliminarEmpresa(empresa).subscribe(
      (eliminada: Mensaje) => {
        this.cargando = false;
        this.toastr.success(eliminada.detalles, eliminada.titulo, { closeButton: true });
        this.empresas.splice(indice, 1);
        this.reiniciarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  //editar empresa
  abrirEditar(empresa: EmpresaCot) {
    const empresaAux: EmpresaCot = EmpresaCot.prototype.nuevaEmpresa(empresa._id, empresa.nombre, empresa.direccion, empresa.contacto, empresa.telefono, empresa.email, empresa.activa);
    const dialogRef = this.dialog.open(EditarEmpresaComponent, { data: empresa });
    dialogRef.afterClosed().subscribe(editar => {
      if (editar) {
        this.editarEmpresa(empresa, empresaAux);
      } else {
        this.restablecerDatosEmpresa(empresa, empresaAux);
      }
    }
    );
  }
  editarEmpresa(empresa: EmpresaCot, empresaAux: EmpresaCot) {
    this.cargando = true;
    this.usuarioService.actualizarEmpresa(empresa).subscribe(
      (actualizado: Mensaje) => {
        this.cargando = false;
        this.toastr.success(actualizado.detalles, actualizado.titulo, { closeButton: true });
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.titulo, err.error.detalles, { closeButton: true });
        this.restablecerDatosEmpresa(empresa, empresaAux);
      }
    );
  }
  restablecerDatosEmpresa(empresa: EmpresaCot, empresaAux: EmpresaCot) {
    const indice = this.empresas.indexOf(empresa);
    this.empresas[indice] = empresaAux;
    this.listData.data = this.empresas;
  }
  reiniciarTabla() {
    this.listData.data = this.empresas;
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaEmpresa.trim().toLowerCase();
  }
  borrarBusqueda() {
    this.busquedaEmpresa = '';
    this.aplicarFiltroBusqueda();
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.empresas);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (empresa: EmpresaCot, filtro: string) => {
      return empresa.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
}
