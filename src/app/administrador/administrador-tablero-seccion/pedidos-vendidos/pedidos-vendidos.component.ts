import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { SeleccionarEmpleadoComponent } from 'src/app/comun/componentes/modales/seleccionar-empleado/seleccionar-empleado.component';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { MostrarVentasFotografosComponent } from 'src/app/comun/componentes/modales/mostrar-ventas-fotografos/mostrar-ventas-fotografos.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

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
  constructor(private usuarioService: UsuarioService, private toastr: NgToastrService, private dialog: MatDialog,
    private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerPedidosVendidos();
  }

  obtenerPedidosVendidos() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo pedidos vendidos...');
    this.usuarioService.obtenerPedidosVendidos(this.filtro).subscribe(
      (pedidos: Pedido[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.pedidos = pedidos;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
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
    this.cargandoService.crearVistaCargando(true, 'Obteniendo pedidos vendidos...');
    this.usuarioService.obtenerPedidosVendidosPorFotografo(<string>empleado._id, this.filtro).subscribe(
      (pedidos: Pedido[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.pedidos = pedidos;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
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
    this.cargandoService.crearVistaCargando(true, 'Obteniendo pedidos...');
    this.usuarioService.obtenerVentasConRetoquePorFotografo().subscribe(
      (resultado) => {
        this.cargandoService.crearVistaCargando(false);
        this.mostrarVentasFotografosCRetoque(resultado);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  mostrarVentasFotografosCRetoque(ventas: any) {
    this.dialog.open(MostrarVentasFotografosComponent, {
      width: '60%',
      data: ventas
    })
  }
}
