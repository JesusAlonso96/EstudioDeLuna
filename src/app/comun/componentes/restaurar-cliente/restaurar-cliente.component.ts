import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmarRestauracionComponent } from './confirmar-restauracion/confirmar-restauracion.component';

@Component({
  selector: 'app-restaurar-cliente',
  templateUrl: './restaurar-cliente.component.html',
  styleUrls: ['./restaurar-cliente.component.scss']
})
export class RestaurarClienteComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'acciones'];
  busquedaCliente: string = '';
  cargando: boolean = false;
  cargandoRestauracion: boolean = false;
  clientesEliminados: Cliente[] = [];
  constructor(private clienteService: ClienteService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerClientesEliminados();
  }
  obtenerClientesEliminados() {
    this.cargando = true;
    this.clienteService.obtenerClientesEliminados().subscribe(
      (clientesEliminados: Cliente[]) => {
        this.cargando = false;
        this.clientesEliminados = clientesEliminados;
        this.inicializarTabla();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  confirmarRestauracion(cliente: Cliente) {
    const dialogRef = this.dialog.open(ConfirmarRestauracionComponent);
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta) {
        this.restaurarClienteEliminado(cliente);
      }
    })
  }
  restaurarClienteEliminado(cliente: Cliente) {
    this.cargandoRestauracion = true;
    this.clienteService.restaurarCliente(cliente._id).subscribe(
      (clienteRestaurado: JSON) => {
        this.toastr.success('Cliente restaurado exitosamente', '', { closeButton: true });
        this.quitarClienteEliminado(cliente);
        this.cargandoRestauracion = false;
      },
      (err: any) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.cargandoRestauracion = false;
      }
    );
  }
  inicializarTabla() {
    this.listData = new MatTableDataSource(this.clientesEliminados);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.filterPredicate = (cliente: Cliente, filtro: string) => {
      return cliente.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
    }
  }
  borrarBusqueda() {
    this.busquedaCliente = '';
    this.aplicarFiltroBusqueda();
  }
  aplicarFiltroBusqueda() {
    this.listData.filter = this.busquedaCliente.trim().toLowerCase();
  }
  quitarClienteEliminado(cliente: Cliente) {
    const indice = this.clientesEliminados.indexOf(cliente);
    this.clientesEliminados.splice(indice, 1);
    this.listData.data = this.clientesEliminados;
  }

}
