import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { BuscadorComponent } from '../buscador/buscador.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { CargandoService } from '../../servicios/cargando.service';
import { NgToastrService } from '../../servicios/ng-toastr.service';

@Component({
  selector: 'app-consulta-cliente',
  templateUrl: './consulta-cliente.component.html',
  styleUrls: ['./consulta-cliente.component.scss']
})
export class ConsultaClienteComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono', 'editar'];
  clientes: Cliente[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private clienteService: ClienteService, 
    private toastr: NgToastrService, 
    private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerClientes();
    this.obtenerNuevosClientes();
    this.obtenerNuevoClienteEditado();
    this.obtenerNuevosClientesEliminados();
  }

  obtenerClientes() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo clientes');
    this.clienteService.obtenerDatosClientes().subscribe(
      (clientes: Cliente[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.clientes = clientes;
      },
      (err) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.titulo, err.error.detalles);
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
          this.toastr.abrirToastr('info','Se ha agregado un nuevo cliente', 'Nuevo cliente');
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
          this.toastr.abrirToastr('info',`Se ha editado al cliente ${cliente.nombre}`, 'Cliente editado');
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
          this.toastr.abrirToastr('advertencia', 'Se ha eliminado un cliente','Nuevo cliente eliminado');
        }
      )
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
