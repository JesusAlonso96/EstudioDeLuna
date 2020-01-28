import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  titulo: string;
  mensaje: string;
  msgBoton: string;
  color: string;
}
@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
