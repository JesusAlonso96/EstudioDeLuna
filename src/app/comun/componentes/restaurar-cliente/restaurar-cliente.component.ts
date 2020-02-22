import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BuscadorComponent } from '../buscador/buscador.component';

@Component({
  selector: 'app-restaurar-cliente',
  templateUrl: './restaurar-cliente.component.html',
  styleUrls: ['./restaurar-cliente.component.scss']
})
export class RestaurarClienteComponent implements OnInit, OnDestroy {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'restaurar'];
  cargando: boolean = false;
  clientes: Cliente[];
  private onDestroy$ = new Subject<boolean>();

  constructor(private clienteService: ClienteService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerClientesEliminados();
    this.obtenerNuevosClientesEliminados();
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

  obtenerNuevosClientesEliminados() {
    this.clienteService.escucharNuevoClienteEliminado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (cliente: Cliente) => {
          this.clientes.push(cliente);
          this.buscador.datosTabla.data = this.clientes;
          this.toastr.warning('Nuevo cliente eliminado', 'Se ha eliminado un cliente', { closeButton: true });
        }
      )
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
