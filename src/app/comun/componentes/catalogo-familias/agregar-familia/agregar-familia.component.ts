import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Familia } from 'src/app/comun/modelos/familia.model';
@Component({
  selector: 'app-agregar-familia',
  templateUrl: './agregar-familia.component.html',
  styleUrls: ['./agregar-familia.component.scss']
})
export class AgregarFamiliaComponent implements OnInit {
  familia: Familia = new Familia();
  constructor(
    public dialogRef: MatDialogRef<AgregarFamiliaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.familia.productos = [];
     }

  ngOnInit() {
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
