import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/comun/servicios/productos.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { MatDialog } from '@angular/material';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-productos-seccion-restaurar',
  templateUrl: './productos-seccion-restaurar.component.html',
  styleUrls: ['./productos-seccion-restaurar.component.scss']
})
export class ProductosSeccionRestaurarComponent implements OnInit {
  familias: Familia[] = [];

  constructor(
    private productosService: ProductosService,
    private cargandoService: CargandoService,
    private toastr: NgToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerProductosInactivos();
  }
  obtenerProductosInactivos() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo productos inactivos');
    this.productosService.obtenerProductosPorFamiliaInactivos().subscribe(
      (familias: Familia[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.familias = familias;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  abrirRestaurarProducto(indiceFamilia: number, indiceProducto: number) {
    const referenciaModal = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Restaurar producto', mensaje: '¿Deseas restaurar este producto?', msgBoton: 'Restaurar', color: 'warn' }
    })
    referenciaModal.afterClosed().subscribe(restaurar => {
      if (restaurar) this.restaurarProducto(indiceFamilia, indiceProducto);
    })
  }
  restaurarProducto(indiceFamilia: number, indiceProducto: number) {
    this.cargandoService.crearVistaCargando(true, 'Restaurando producto')
    this.productosService.restaurarProducto(this.familias[indiceFamilia].productos[indiceProducto]._id).subscribe(
      (restaurado) => {
        this.familias[indiceFamilia].productos.splice(indiceProducto, 1);
        this.toastr.abrirToastr('exito', 'Producto restaurado correctamente', '');
        this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
        this.cargandoService.crearVistaCargando(false);
      }
    );
  }

}
