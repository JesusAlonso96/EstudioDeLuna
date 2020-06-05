import { Component, OnInit, Inject } from '@angular/core';
import { TipoGastoGeneral } from 'src/app/comun/modelos/tipo_gasto_general.model';
import { TiposDePersona } from 'src/app/comun/enumeraciones/tipos-de-persona.enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-editar-tipo-gasto-general',
  templateUrl: './editar-tipo-gasto-general.component.html',
  styleUrls: ['./editar-tipo-gasto-general.component.scss']
})
export class EditarTipoGastoGeneralComponent implements OnInit {
  cargando: boolean = false;
  TiposDePersona = TiposDePersona;
  
  constructor(public dialogRef: MatDialogRef<EditarTipoGastoGeneralComponent>,
    @Inject(MAT_DIALOG_DATA) public tipoGastoGeneral: TipoGastoGeneral) { }

  ngOnInit() {}

  onNoClick() {
    this.dialogRef.close();
  }
}
