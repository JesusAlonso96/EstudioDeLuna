import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClienteService } from 'src/app/comun/servicios/cliente.service';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { environment } from '../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pedidos-cliente',
  templateUrl: './pedidos-cliente.component.html',
  styleUrls: ['./pedidos-cliente.component.scss']
})
export class PedidosClienteComponent implements OnInit {
  urlFotos: string = environment.url_fotos;
  pedidos: Pedido[] = [];
  constructor(public dialogRef: MatDialogRef<PedidosClienteComponent>, @Inject(MAT_DIALOG_DATA) public idCliente: string, private clienteService: ClienteService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerPedidos();
  }
  obtenerPedidos() {
    this.clienteService.obtenerPedidosCliente(this.idCliente).subscribe(
      (pedidos) => {
        this.pedidos = pedidos;
        console.log(this.pedidos);
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
