import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { OrdenCompra } from 'src/app/comun/modelos/orden_compra.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { VerInsumosOrdenDeCompraComponent } from '../ver-insumos-orden-de-compra/ver-insumos-orden-de-compra.component';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-seleccionar-orden-de-compra',
  templateUrl: './seleccionar-orden-de-compra.component.html',
  styleUrls: ['./seleccionar-orden-de-compra.component.scss']
})
export class SeleccionarOrdenDeCompraComponent implements OnInit {
  cargando: boolean = false;
  ordenes: OrdenCompra[] = [];
  ordenSeleccionada: OrdenCompra = new OrdenCompra();

  constructor(public dialogRef: MatDialogRef<SeleccionarOrdenDeCompraComponent>,
    private usuarioService: UsuarioService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerOrdenesDeCompra();
  }
  obtenerOrdenesDeCompra() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo ordenes de compra');
    this.usuarioService.obtenerOrdenesCompra().subscribe(
      (ordenes: OrdenCompra[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.ordenes = ordenes;
        console.log(ordenes)
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.titulo, err.error.detalles);
      }
    );
  }
  onNoClick() {
    this.dialogRef.close();
  }
  verInsumos(orden: OrdenCompra) {
    this.dialog.open(VerInsumosOrdenDeCompraComponent, {
      data: orden.productosOrdenCompra
    });
  }
  seleccionarOrden(orden: OrdenCompra) {
    this.ordenSeleccionada = orden;
  }
  estaSeleccionada(orden: OrdenCompra): boolean {
    return this.ordenSeleccionada.id == orden.id ? true : false;
  }
  aceptarOrdenDeCompra(){
    this.dialogRef.close(this.ordenSeleccionada);
  }
}
