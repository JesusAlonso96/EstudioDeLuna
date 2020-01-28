import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-baja-cliente',
  templateUrl: './baja-cliente.component.html',
  styleUrls: ['./baja-cliente.component.scss']
})
export class BajaClienteComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'acciones'];
  clientes: Cliente[];
  busquedaCliente: string = '';
  cargando: boolean = false;
  constructor(public dialog: MatDialog, private clienteService: ClienteService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.cargando = true;
    this.clienteService.obtenerDatosClientes().subscribe(
      (clientes: Cliente[]) => {
        this.cargando = false;
        this.clientes = clientes;
        this.inicializarTabla()
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

  borrarBusqueda() {
    this.busquedaCliente = '';
    this.aplicarFiltroBusqueda();
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaCliente.trim().toLowerCase();
  }
  confirmarEliminacion(cliente: Cliente) {
    const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Eliminar cliente', mensaje: '¿Desea eliminar este cliente?', msgBoton: 'Eliminar', color: 'warn' }
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.eliminarCliente(cliente);
      }
    });
  }
  eliminarCliente(cliente: Cliente) {
    this.cargando = true;
    const indice = this.clientes.indexOf(cliente);
    this.clienteService.eliminarCliente(cliente._id).subscribe(
      (eliminado) => {
        this.cargando = false;
        this.toastr.success('Cliente eliminado exitosamente', '', { closeButton: true });
        this.clientes.splice(indice, 1);
        this.listData.data = this.clientes;

      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      });

  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.clientes);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (cliente: Cliente, filtro: string) => {
      return cliente.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
}
