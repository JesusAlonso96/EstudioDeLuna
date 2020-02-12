import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from '../../modelos/cliente.model';
import { ClienteService } from '../../servicios/cliente.service';

@Component({
  selector: 'app-baja-cliente',
  templateUrl: './baja-cliente.component.html',
  styleUrls: ['./baja-cliente.component.scss']
})
export class BajaClienteComponent implements OnInit {
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'email', 'telefono','borrar'];
  clientes: Cliente[];
  cargando: boolean = false;

  constructor(private clienteService: ClienteService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.cargando = true;
    this.clienteService.obtenerDatosClientes().subscribe(
      (clientes: Cliente[]) => {
        this.cargando = false;
        this.clientes = clientes;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
}
