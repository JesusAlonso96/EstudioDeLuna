import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { Almacen } from 'src/app/comun/modelos/almacen.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { ToastrService } from 'ngx-toastr';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-inventarios-almacenes-restaurar',
  templateUrl: './inventarios-almacenes-restaurar.component.html',
  styleUrls: ['./inventarios-almacenes-restaurar.component.scss']
})
export class InventariosAlmacenesRestaurarComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  columnas: string[] = ['id', 'nombre', 'direccion', 'restaurar'];
  almacenes: Almacen[];
  cargando: boolean = false;
  constructor(private almacenService: AlmacenService,
    private cargandoService: CargandoService,
    private toastr: NgToastrService) { }

  ngOnInit() {
    this.obtenerAlmacenes();
  }
  obtenerAlmacenes() {
    this.cargandoService.crearVistaCargando(true,'Cargando almacenes');
    this.almacenService.obtenerAlmacenesEliminados().subscribe(
      (almacenes: Almacen[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.almacenes = almacenes;
        console.log(this.almacenes);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    )
  }
}
