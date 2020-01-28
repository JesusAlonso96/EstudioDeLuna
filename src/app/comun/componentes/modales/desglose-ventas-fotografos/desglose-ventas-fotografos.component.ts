import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-desglose-ventas-fotografos',
  templateUrl: './desglose-ventas-fotografos.component.html',
  styleUrls: ['./desglose-ventas-fotografos.component.scss']
})
export class DesgloseVentasFotografosComponent {

  constructor(
    public dialogRef: MatDialogRef<DesgloseVentasFotografosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
