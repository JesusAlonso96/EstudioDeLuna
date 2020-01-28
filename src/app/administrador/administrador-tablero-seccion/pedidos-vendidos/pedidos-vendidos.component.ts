import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { SeleccionarEmpleadoComponent } from 'src/app/comun/componentes/modales/seleccionar-empleado/seleccionar-empleado.component';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { MostrarVentasFotografosComponent } from 'src/app/comun/componentes/modales/mostrar-ventas-fotografos/mostrar-ventas-fotografos.component';

@Component({
  selector: 'app-pedidos-vendidos',
  templateUrl: './pedidos-vendidos.component.html',
  styleUrls: ['./pedidos-vendidos.component.scss']
})
export class PedidosVendidosComponent implements OnInit {
  pedidos: Pedido[];
  cargando: boolean = false;
  empleadoSeleccionado: Usuario;
  filtro: number = 1;
  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerPedidosVendidos();
  }

  obtenerPedidosVendidos() {
    this.cargando = true;
    this.usuarioService.obtenerPedidosVendidos(this.filtro).subscribe(
      (pedidos: Pedido[]) => {
        this.cargando = false;
        this.pedidos = pedidos;
        console.log(this.pedidos);
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
        this.obtenerPedidosVendidosPorEmpleado(empleado);
      }
    })
  }
  obtenerPedidosVendidosPorEmpleado(empleado: Usuario) {
    this.cargando = true;
    this.usuarioService.obtenerPedidosVendidosPorFotografo(<string>empleado._id, this.filtro).subscribe(
      (pedidos: Pedido[]) => {
        this.cargando = false;
        this.pedidos = pedidos;
        console.log(this.pedidos);
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.erorr.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  quitarFiltro() {
    this.empleadoSeleccionado = undefined;
    this.obtenerPedidosVendidos();
  }
  buscarFiltro() {
    if (this.empleadoSeleccionado != undefined) {
      this.obtenerPedidosVendidosPorEmpleado(this.empleadoSeleccionado);
    } else {
      this.obtenerPedidosVendidos();
    }
  }
  obtenerVendidos() {
    this.cargando = true;
    this.usuarioService.obtenerVentasConRetoquePorFotografo().subscribe(
      (resultado) => {
        this.cargando = false;
        this.mostrarVentasFotografosCRetoque(resultado);
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  mostrarVentasFotografosCRetoque(ventas: any){
    this.dialog.open(MostrarVentasFotografosComponent, {
      width: '60%',
      data: ventas
    })
  }
}
