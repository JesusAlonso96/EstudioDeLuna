import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Almacen } from 'src/app/comun/modelos/almacen.model';
import { AltaAlmacenComponent } from 'src/app/comun/componentes/modales/alta-almacen/alta-almacen.component';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-inventarios-almacenes-detalles',
  templateUrl: './inventarios-almacenes-detalles.component.html',
  styleUrls: ['./inventarios-almacenes-detalles.component.scss']
})
export class InventariosAlmacenesDetallesComponent implements OnInit {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnas: string[] = ['id', 'nombre', 'direccion', 'editar', 'eliminar'];
  almacenes: Almacen[];
  cargando: boolean = false;
  constructor(private almacenService: AlmacenService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerAlmacenes();
  }
  obtenerAlmacenes() {
    this.cargando = true;
    this.almacenService.obtenerAlmacenes().subscribe(
      (almacenes: Almacen[]) => {
        this.cargando = false;
        this.almacenes = almacenes;
        console.log(this.almacenes);
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
    this.cargando = true;
    this.almacenService.nuevoAlmacen(almacen).subscribe(
      (almacen: Almacen) => {
        this.cargando = false;
        this.toastr.success(`Se ha agregado exitosamente el almacen ${almacen.id}`, 'Almacen agregado exitosamente', { closeButton: true });
        this.almacenes.push(almacen);
        this.buscador.datosTabla.data = this.almacenes;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )
  }

}
