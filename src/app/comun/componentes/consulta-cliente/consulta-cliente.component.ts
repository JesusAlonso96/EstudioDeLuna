import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';
import { BuscadorComponent } from '../buscador/buscador.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-consulta-cliente',
  templateUrl: './consulta-cliente.component.html',
  styleUrls: ['./consulta-cliente.component.scss']
})
export class ConsultaClienteComponent implements OnInit, OnDestroy {
  @ViewChild('buscador', {static:false}) buscador: BuscadorComponent;
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono','editar'];
  clientes: Cliente[];
  cargando: boolean = false;
  private onDestroy$ = new Subject<boolean>();

  constructor(private clienteService: ClienteService, private toastr: ToastrService) { }
  
  ngOnInit() {
    this.obtenerClientes();
    this.obtenerNuevosClientes();
  }

  obtenerClientes() {
    this.cargando = true;
    this.clienteService.obtenerDatosClientes().subscribe(
      (clientes: Cliente[]) => {
        this.cargando = false;
        this.clientes = clientes;
      },
      (err) => {
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
      (cliente: Cliente)=>{
        this.clientes.push(cliente);
        this.buscador.datosTabla.data = this.clientes;
        this.toastr.info('Nuevo cliente','Se ha agregado un nuevo cliente', {closeButton:true});
      }
    )
  }
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
