import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-cantidad',
  templateUrl: './editar-cantidad.component.html',
  styleUrls: ['./editar-cantidad.component.scss']
})
export class EditarCantidadComponent implements OnInit {

  cantidad: number;

  constructor(
    public dialogRef: MatDialogRef<EditarCantidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
