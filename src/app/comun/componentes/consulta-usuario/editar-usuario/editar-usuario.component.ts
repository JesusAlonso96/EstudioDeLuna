import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Usuario } from 'src/app/comun/modelos/usuario.model';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent {

  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioComponent>, @Inject(MAT_DIALOG_DATA) public data: Usuario) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
