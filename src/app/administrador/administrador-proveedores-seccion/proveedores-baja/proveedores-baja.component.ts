import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';

@Component({
  selector: 'app-proveedores-baja',
  templateUrl: './proveedores-baja.component.html',
  styleUrls: ['./proveedores-baja.component.scss']
})
export class ProveedoresBajaComponent implements OnInit {
  columnasTabla: string[] = ['nombre', 'rfc', 'telefono', 'ciudad','borrar'];
  proveedores: Proveedor[];
  cargando: boolean = false;
  
  constructor(private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedores();
  }
  obtenerProveedores() {
    this.cargando = true;
    this.usuarioService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.cargando = false;
        this.proveedores = proveedores;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

}
