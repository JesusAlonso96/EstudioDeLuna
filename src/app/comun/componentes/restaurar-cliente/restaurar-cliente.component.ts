import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BuscadorComponent } from '../buscador/buscador.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from '../../servicios/cargando.service';

@Component({
  selector: 'app-restaurar-cliente',
  templateUrl: './restaurar-cliente.component.html',
  styleUrls: ['./restaurar-cliente.component.scss']
})
export class RestaurarClienteComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'opciones'];
  cargando: boolean = false;
  clientes: Cliente[];
  private onDestroy$ = new Subject<boolean>();
  constructor(
    private clienteService: ClienteService, 
    private toastr: ToastrService,
    private cargandoService: CargandoService
    ) { }

  ngOnInit() {
    this.obtenerClientesEliminados();
    this.obtenerNuevosClientesEliminados();
    this.obtenerNuevoClienteRestaurado();
  }
  obtenerClientesEliminados() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo clientes eliminados..')
    this.clienteService.obtenerClientesEliminados().subscribe(
      (clientesEliminados: Cliente[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.clientes = clientesEliminados;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
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
  obtenerNuevoClienteRestaurado() {
    this.clienteService.escucharNuevoClienteRestaurado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (cliente: Cliente) => {
          const clienteRestaurado = this.clientes.find(clienteFil => { clienteFil._id == cliente._id });
          const indice = this.clientes.indexOf(clienteRestaurado);
          this.clientes.splice(indice, 1);
          this.buscador.datosTabla.data = this.clientes;
          this.toastr.warning('Se ha restaurado un cliente', 'Cliente restaurado', { closeButton: true });
        }
      )
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
