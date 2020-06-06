import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Almacen } from 'src/app/comun/modelos/almacen.model';
import { AltaAlmacenComponent } from 'src/app/comun/componentes/modales/alta-almacen/alta-almacen.component';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { MatDialog } from '@angular/material';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-inventarios-almacenes-detalles',
  templateUrl: './inventarios-almacenes-detalles.component.html',
  styleUrls: ['./inventarios-almacenes-detalles.component.scss']
})
export class InventariosAlmacenesDetallesComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['id', 'nombre', 'direccion', 'editar', 'eliminar'];
  almacenes: Almacen[];
  cargando: boolean = false;
  constructor(private almacenService: AlmacenService,
    private toastr: NgToastrService,
    private cargandoService: CargandoService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerAlmacenes();
  }
  obtenerAlmacenes() {
    this.cargandoService.crearVistaCargando(true,'Obteniendo almacenes');
    this.almacenService.obtenerAlmacenes().subscribe(
      (almacenes: Almacen[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.almacenes = almacenes;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    )
  }
  nuevoAlmacen() {
    const dialogRef = this.dialog.open(AltaAlmacenComponent);
    dialogRef.afterClosed().subscribe(almacen => {
      if (almacen) {
        this.agregarAlmacen(almacen);
      }
    })
  }

  agregarAlmacen(almacen: Almacen) {
    this.cargandoService.crearVistaCargando(true,'Guardando almacen');
    this.almacenService.nuevoAlmacen(almacen).subscribe(
      (almacen: Almacen) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito',`Se ha agregado exitosamente el almacen ${almacen.id}`, 'Almacen agregado exitosamente');
        this.almacenes.push(almacen);
        this.buscador.datosTabla.data = this.almacenes;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }

}
