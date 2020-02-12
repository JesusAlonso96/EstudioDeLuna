import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';

@Component({
  selector: 'app-usuarios-baja',
  templateUrl: './usuarios-baja.component.html',
  styleUrls: ['./usuarios-baja.component.scss']
})
export class UsuariosBajaComponent implements OnInit {
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol','borrar'];
  usuarios: Usuario[];
  cargando: boolean = false;

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.cargando = true;
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        this.cargando = false;
        this.usuarios = usuarios;
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
}
