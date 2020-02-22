import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { BuscadorComponent } from '../buscador/buscador.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-baja-cliente',
  templateUrl: './baja-cliente.component.html',
  styleUrls: ['./baja-cliente.component.scss']
})
export class BajaClienteComponent implements OnInit, OnDestroy {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'borrar'];
  clientes: Cliente[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private clienteService: ClienteService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerClientes();
    this.obtenerNuevosClientes();
    this.obtenerNuevoClienteEditado();
  }

  obtenerClientes() {
    this.cargando = true;
    this.clienteService.obtenerDatosClientes().subscribe(
      (clientes: Cliente[]) => {
        this.cargando = false;
        this.clientes = clientes;
        console.log(this.clientes);
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
          this.toastr.info('Se ha agregado un nuevo cliente', 'Nuevo cliente', { closeButton: true });
        }
      );
  }
  obtenerNuevoClienteEditado() {
    this.clienteService.escucharNuevoClienteEditado()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (cliente: Cliente) => {
          const clienteEncontrado = this.clientes.find(clienteFil => { return clienteFil._id == cliente._id })
          const indice = this.clientes.indexOf(clienteEncontrado);
          this.clientes[indice] = cliente;
          this.buscador.datosTabla.data = this.clientes;
          this.toastr.info('Se ha editado un nuevo cliente', 'Nuevo cliente', { closeButton: true });
        }
      );
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
