import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-restauracion',
  templateUrl: './confirmar-restauracion.component.html',
  styleUrls: ['./confirmar-restauracion.component.scss']
})
export class ConfirmarRestauracionComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmarRestauracionComponent>) { }
  onNoClick(): void { this.dialogRef.close(); }
}
