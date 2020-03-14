import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { OrdenCompra } from 'src/app/comun/modelos/orden_compra.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-historial-ordenes-compra',
  templateUrl: './historial-ordenes-compra.component.html',
  styleUrls: ['./historial-ordenes-compra.component.scss']
})
export class HistorialOrdenesCompraComponent implements OnInit {
  ordenes: OrdenCompra[] = [];
  cargando: boolean = false;
  constructor(private usuarioService: UsuarioService, private toastr: ToastrService) { }

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
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

}
