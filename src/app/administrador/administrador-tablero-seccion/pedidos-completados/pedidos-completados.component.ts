import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { SeleccionarEmpleadoComponent } from 'src/app/comun/componentes/modales/seleccionar-empleado/seleccionar-empleado.component';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-pedidos-completados',
  templateUrl: './pedidos-completados.component.html',
  styleUrls: ['./pedidos-completados.component.scss']
})
export class PedidosCompletadosComponent implements OnInit {
  buscar: boolean = false;
  cargando: boolean = false;
  pedidos: Pedido[] = [];
  empleadoSeleccionado: Usuario;
  url_fotos: string = environment.url_fotos;
  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerPedidosRealizados();
  }
  obtenerPedidosRealizados() {
    this.cargando = true;
    this.usuarioService.obtenerPedidosRealizados().subscribe(
      (pedidos: Pedido[]) => {
        this.cargando = false;
        this.pedidos = pedidos;
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  seleccionarEmpleado() {
    const dialogRef = this.dialog.open(SeleccionarEmpleadoComponent);
    dialogRef.afterClosed().subscribe(empleado => {
      if (empleado) {
        this.empleadoSeleccionado = empleado;
        this.obtenerPedidosRealizadosPorFotografo(empleado);
      }
    })
  }
  obtenerPedidosRealizadosPorFotografo(empleado: Usuario) {
    this.cargando = true;
    this.usuarioService.obtenerPedidosRealizadosPorFotografo(<string>empleado._id).subscribe(
      (pedidos: Pedido[]) => {
        this.cargando = false;
        this.pedidos = pedidos;
        this.buscar = true;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )
  }
  quitarFiltro() {
    this.empleadoSeleccionado = undefined;
    this.obtenerPedidosRealizados();
  }
 
}
