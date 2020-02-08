import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.component.html',
  styleUrls: ['./editar-empresa.component.scss']
})
export class EditarEmpresaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditarEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public empresa: EmpresaCot) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() { }

}
