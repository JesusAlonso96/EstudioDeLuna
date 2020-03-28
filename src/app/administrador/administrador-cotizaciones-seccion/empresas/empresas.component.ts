import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { BuscadorComponent } from 'src/app/comun/componentes/buscador/buscador.component';
import { AltaEmpresaComponent } from 'src/app/comun/componentes/modales/alta-empresa/alta-empresa.component';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
  providers: []
})
export class EmpresasComponent implements OnInit {
  @ViewChild('buscador') buscador: BuscadorComponent;
  displayedColumns: string[] = ['nombre', 'contacto', 'email', 'editar', 'eliminar'];
  empresas: EmpresaCot[];
  cargando: boolean = false;
  constructor(private dialog: MatDialog, private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerEmpresas();
  }
  obtenerEmpresas() {
    this.cargando = true;
    this.usuarioService.obtenerEmpresas().subscribe(
      (empresas: EmpresaCot[]) => {
        this.cargando = false;
        this.empresas = empresas;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  nuevaEmpresa() {
    const dialogRef = this.dialog.open(AltaEmpresaComponent);
    dialogRef.afterClosed().subscribe(empresa => {
      if (empresa) {
        this.agregarEmpresa(empresa);
      }
    })
  }
  agregarEmpresa(empresa: EmpresaCot) {
    this.cargando = true;
    this.usuarioService.agregarEmpresa(empresa).subscribe(
      (agregada: Mensaje) => {
        this.cargando = false;
        this.toastr.success(agregada.detalles, agregada.detalles, { closeButton: true });
        this.empresas.push(empresa);
        this.buscador.datosTabla.data = this.empresas;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
}
