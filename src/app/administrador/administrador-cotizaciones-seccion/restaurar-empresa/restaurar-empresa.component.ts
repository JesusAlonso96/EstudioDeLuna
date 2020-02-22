import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { AdministradorService } from '../../servicio-administrador/servicio-administrador.service';

@Component({
  selector: 'app-restaurar-empresa',
  templateUrl: './restaurar-empresa.component.html',
  styleUrls: ['./restaurar-empresa.component.scss']
})
export class RestaurarEmpresaComponent implements OnInit {
  empresas: EmpresaCot[];
  columnas: string[] = ['nombre', 'contacto', 'email', 'restaurar'];
  cargando: boolean = false;

  constructor(private adminService: AdministradorService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerEmpresasEliminadas();
  }
  obtenerEmpresasEliminadas() {
    this.cargando = true;
    this.adminService.obtenerEmpresasEliminadas().subscribe(
      (empresasEliminadas: EmpresaCot[]) => {
        this.cargando = false;
        this.empresas = empresasEliminadas;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }

    );
  }
}
