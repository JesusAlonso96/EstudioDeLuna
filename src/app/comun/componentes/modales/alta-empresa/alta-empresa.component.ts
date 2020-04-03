import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { TemasService } from 'src/app/comun/servicios/temas.service';

@Component({
  selector: 'app-alta-empresa',
  templateUrl: './alta-empresa.component.html',
  styleUrls: ['./alta-empresa.component.scss']
})
export class AltaEmpresaComponent implements OnInit {
  nuevaEmpresa: EmpresaCot = new EmpresaCot();
  constructor(public dialogRef: MatDialogRef<AltaEmpresaComponent>, public temasService: TemasService) { }

  ngOnInit() {
    
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
