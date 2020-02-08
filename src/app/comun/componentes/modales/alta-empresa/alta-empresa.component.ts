import { Component, OnInit } from '@angular/core';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { MatDialogRef } from '@angular/material';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alta-empresa',
  templateUrl: './alta-empresa.component.html',
  styleUrls: ['./alta-empresa.component.scss']
})
export class AltaEmpresaComponent implements OnInit {
  nuevaEmpresa: EmpresaCot = new EmpresaCot();
  constructor(public dialogRef: MatDialogRef<AltaEmpresaComponent>, private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
