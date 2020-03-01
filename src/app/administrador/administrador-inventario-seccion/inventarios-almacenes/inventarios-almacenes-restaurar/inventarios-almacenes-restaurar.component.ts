import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Almacen } from 'src/app/comun/modelos/almacen.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventarios-almacenes-restaurar',
  templateUrl: './inventarios-almacenes-restaurar.component.html',
  styleUrls: ['./inventarios-almacenes-restaurar.component.scss']
})
export class InventariosAlmacenesRestaurarComponent implements OnInit {
  @ViewChild('buscador', { static: false }) buscador: BuscadorComponent;
  columnas: string[] = ['id', 'nombre', 'direccion', 'restaurar'];
  almacenes: Almacen[];
  cargando: boolean = false;
  constructor(private almacenService: AlmacenService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerAlmacenes();
  }
  obtenerAlmacenes() {
    this.cargando = true;
    this.almacenService.obtenerAlmacenesEliminados().subscribe(
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
}
