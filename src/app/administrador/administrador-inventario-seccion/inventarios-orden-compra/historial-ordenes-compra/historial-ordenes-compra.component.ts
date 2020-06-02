import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { OrdenCompra } from 'src/app/comun/modelos/orden_compra.model';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-historial-ordenes-compra',
  templateUrl: './historial-ordenes-compra.component.html',
  styleUrls: ['./historial-ordenes-compra.component.scss']
})
export class HistorialOrdenesCompraComponent implements OnInit {
  ordenes: OrdenCompra[] = [];
  cargando: boolean = false;
  constructor(private usuarioService: UsuarioService, private toastr: NgToastrService) { }

  ngOnInit() {
    this.obtenerOrdenesCompra();
  }

  obtenerOrdenesCompra() {
    this.cargando = true;
    this.usuarioService.obtenerOrdenesCompra().subscribe(
      (ordenes: OrdenCompra[]) => {
        this.cargando = false;
        this.ordenes = ordenes;
        console.log(this.ordenes);
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );
  }

}
