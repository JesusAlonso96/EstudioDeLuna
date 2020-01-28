import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-familia',
  templateUrl: './eliminar-familia.component.html',
  styleUrls: ['./eliminar-familia.component.scss']
})
export class EliminarFamiliaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EliminarFamiliaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
