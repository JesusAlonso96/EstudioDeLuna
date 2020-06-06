import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { OrdenCompra } from 'src/app/comun/modelos/orden_compra.model';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-historial-ordenes-compra',
  templateUrl: './historial-ordenes-compra.component.html',
  styleUrls: ['./historial-ordenes-compra.component.scss']
})
export class HistorialOrdenesCompraComponent implements OnInit {
  ordenes: OrdenCompra[] = [];
  cargando: boolean = false;
  constructor(private usuarioService: UsuarioService, private toastr: NgToastrService,private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerOrdenesCompra();
  }

  obtenerOrdenesCompra() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo ordenes de compra');
    this.usuarioService.obtenerOrdenesCompra().subscribe(
      (ordenes: OrdenCompra[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.ordenes = ordenes;
        console.log(this.ordenes);
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );
  }

}
