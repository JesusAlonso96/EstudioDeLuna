import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { DatosClienteComponent } from './datos-cliente/datos-cliente.component';
import { EditarClienteComponent } from './editar-cliente/editar-cliente.component';

@Component({
  selector: 'app-consulta-cliente',
  templateUrl: './consulta-cliente.component.html',
  styleUrls: ['./consulta-cliente.component.scss']
})
export class ConsultaClienteComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'vermas', 'editar'];
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
        this.listData = new MatTableDataSource(this.clientes);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.filterPredicate = (cliente: Cliente, filtro: string) => {
          return cliente.nombre.trim().toLowerCase().indexOf(filtro) !== -1;
        }
      },
      (err) => {
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
  verPerfil(cliente: Cliente) {
   this.dialog.open(DatosClienteComponent, { data: cliente });
  }
  abrirEditarCliente(cliente: Cliente) {
    const clienteAux = new Cliente(cliente._id, cliente.nombre, cliente.username, cliente.ape_pat, cliente.ape_mat, cliente.email, cliente.telefono, cliente.contrasena, cliente.razonSocial, cliente.rfc, cliente.direccion, cliente.colonia, cliente.municipio, cliente.estado, cliente.cp, cliente.num_ext, cliente.num_int, cliente.pedidos, cliente.fecha_registro, cliente.activo);
    const dialogRef = this.dialog.open(EditarClienteComponent, { data: cliente });
    dialogRef.afterClosed().subscribe(editar => {
      if (editar) {
        this.editarCliente(cliente, clienteAux);
      } else {
        this.restablecerDatosCliente(cliente, clienteAux);
      }
    })
  }
  editarCliente(cliente: Cliente, clienteRespaldo: Cliente) {
    this.cargando = true;
    this.clienteService.editarCliente(cliente).subscribe(
      (clienteActualizado: any) => {
        this.toastr.success('Datos actualizados correctamente', '', { closeButton: true });
        this.cargando = false;
      },
      (err: any) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.restablecerDatosCliente(cliente, clienteRespaldo);
        this.cargando = false;
      }
    );
  }
  restablecerDatosCliente(cliente: Cliente, clienteAuxiliar: Cliente) {
    const indice = this.clientes.indexOf(cliente);
    this.clientes[indice] = clienteAuxiliar;
    this.listData.data = this.clientes;
  }
}
