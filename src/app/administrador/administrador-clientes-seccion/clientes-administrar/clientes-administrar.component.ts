import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Cliente } from 'src/app/comun/modelos/cliente.model';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { ClienteService } from 'src/app/comun/servicios/cliente.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';

@Component({
  selector: 'app-clientes-administrar',
  templateUrl: './clientes-administrar.component.html',
  styleUrls: ['./clientes-administrar.component.scss']
})
export class ClientesAdministrarComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'opciones'];
  clientes: Cliente[];
  private onDestroy$ = new Subject<boolean>();
  constructor(
    private clienteService: ClienteService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerNuevosClientes();
    this.obtenerNuevoClienteEditado();
    this.obtenerNuevosClientesEliminados();
  }
  obtenerClientes() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo clientes..')
    this.clienteService.obtenerDatosClientes().subscribe(
      (clientes: Cliente[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.clientes = clientes;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  obtenerNuevosClientes() {
    this.clienteService.escucharNuevoCliente()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (cliente: Cliente) => {
          this.clientes.push(cliente);
          this.buscador.datosTabla.data = this.clientes;
          this.toastr.abrirToastr('info', 'Nuevo cliente', 'Se ha agregado un nuevo cliente');
        }
      )
  }
  obtenerNuevoClienteEditado() {
    this.clienteService.escucharNuevoClienteEditado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (cliente: Cliente) => {
          const clienteEncontrado = this.clientes.find(clienteFil => { return clienteFil._id == cliente._id });
          const indice = this.clientes.indexOf(clienteEncontrado);
          this.clientes[indice] = cliente;
          this.buscador.datosTabla.data = this.clientes;
          this.toastr.abrirToastr('info', 'Cliente editado', `Se ha editado al cliente ${cliente.nombre}`);
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
          const clienteEliminado = this.clientes.find(clienteFil => { return clienteFil._id == cliente._id });
          const indice = this.clientes.indexOf(clienteEliminado);
          this.clientes.splice(indice, 1);
          this.buscador.datosTabla.data = this.clientes;
          this.toastr.abrirToastr('advertencia', 'Nuevo cliente eliminado', 'Se ha eliminado un cliente');
        }
      )
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
