import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-restaurar-cliente',
  templateUrl: './restaurar-cliente.component.html',
  styleUrls: ['./restaurar-cliente.component.scss']
})
export class RestaurarClienteComponent implements OnInit {
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono','restaurar'];
  cargando: boolean = false;
  clientes: Cliente[];
  constructor(private clienteService: ClienteService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerClientesEliminados();
  }
  obtenerClientesEliminados() {
    this.cargando = true;
    this.clienteService.obtenerClientesEliminados().subscribe(
      (clientesEliminados: Cliente[]) => {
        this.cargando = false;
        this.clientes = clientesEliminados;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

}
