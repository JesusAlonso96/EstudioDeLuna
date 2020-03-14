import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { OrdenCompra } from 'src/app/comun/modelos/orden_compra.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { VerInsumosOrdenDeCompraComponent } from '../ver-insumos-orden-de-compra/ver-insumos-orden-de-compra.component';

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
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerOrdenesDeCompra();
  }
  obtenerOrdenesDeCompra() {
    this.cargando = true;
    this.usuarioService.obtenerOrdenesCompra().subscribe(
      (ordenes: OrdenCompra[]) => {
        this.cargando = false;
        this.ordenes = ordenes;
        console.log(ordenes)
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
