import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';

@Component({
  selector: 'app-proveedores-restaurar',
  templateUrl: './proveedores-restaurar.component.html',
  styleUrls: ['./proveedores-restaurar.component.scss']
})
export class ProveedoresRestaurarComponent implements OnInit {
  columnas: string[] = ['nombre', 'rfc', 'telefono', 'ciudad', 'restaurar'];
  proveedores: Proveedor[];
  cargando: boolean = false;

  constructor(private adminService: AdministradorService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedoresEliminados();
  }

  obtenerProveedoresEliminados() {
    this.cargando = true;
    this.adminService.obtenerProveedoresEliminados().subscribe(
      (proveedoresEliminados: Proveedor[]) => {
        this.cargando = false;
        this.proveedores = proveedoresEliminados;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
}
