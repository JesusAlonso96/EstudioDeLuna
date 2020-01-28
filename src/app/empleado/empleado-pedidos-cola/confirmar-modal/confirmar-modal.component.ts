import { Component } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-modal',
  templateUrl: './confirmar-modal.component.html',
  styleUrls: ['./confirmar-modal.component.scss']
})
export class ConfirmarModalComponent  {

  constructor(
    public dialogRef: MatDialogRef<ConfirmarModalComponent>) {}

    onNoClick(): void {
      this.dialogRef.close();
    }
  

}
