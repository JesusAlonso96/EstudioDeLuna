import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';

@Component({
  selector: 'app-usuarios-restaurar',
  templateUrl: './usuarios-restaurar.component.html',
  styleUrls: ['./usuarios-restaurar.component.scss']
})
export class UsuariosRestaurarComponent implements OnInit {
  columnas: string[] = ['nombre', 'ape_pat', 'ape_mat', 'rol', 'restaurar'];
  usuarios: Usuario[];
  cargando: boolean = false;

  constructor(private adminService: AdministradorService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerUsuariosEliminados();
  }
  obtenerUsuariosEliminados() {
    this.cargando = true;
    this.adminService.obtenerUsuariosEliminados().subscribe(
      (usuariosEliminados: Usuario[]) => {
        this.cargando = false;
        this.usuarios = usuariosEliminados;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

}
