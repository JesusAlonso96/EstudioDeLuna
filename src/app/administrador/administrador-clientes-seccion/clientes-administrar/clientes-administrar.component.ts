import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Cliente } from 'src/app/comun/modelos/cliente.model';
import { Subject } from 'rxjs';
import { ClienteService } from 'src/app/comun/servicios/cliente.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-clientes-administrar',
  templateUrl: './clientes-administrar.component.html',
  styleUrls: ['./clientes-administrar.component.scss']
})
export class ClientesAdministrarComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  @Output() cargandoEvento = new EventEmitter(true);
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'opciones'];
  clientes: Cliente[];
  private onDestroy$ = new Subject<boolean>();
  constructor(private clienteService: ClienteService,
    private toastr: NgToastrService,
    private authService: ServicioAutenticacionService) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerNuevosClientes();
    this.obtenerNuevoClienteEditado();
    this.obtenerNuevosClientesEliminados();
  }
  obtenerClientes() {
    this.crearVistaCargando(true, 'Obteniendo clientes..')
    this.clienteService.obtenerDatosClientes().subscribe(
      (clientes: Cliente[]) => {
        this.crearVistaCargando(false);
        this.clientes = clientes;
      },
      (err: HttpErrorResponse) => {
        this.crearVistaCargando(false);
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
  crearVistaCargando(cargando: boolean, texto?: string) {
    this.cargandoEvento.emit({ cargando, texto: texto ? texto : '' });
  }
}
