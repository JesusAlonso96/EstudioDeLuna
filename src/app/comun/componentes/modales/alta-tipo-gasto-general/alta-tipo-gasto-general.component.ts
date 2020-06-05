import { Component, OnInit } from '@angular/core';
import { TipoGastoGeneral } from 'src/app/comun/modelos/tipo_gasto_general.model';
import { MatDialogRef } from '@angular/material';
import { TiposDePersona } from 'src/app/comun/enumeraciones/tipos-de-persona.enum';

@Component({
  selector: 'app-alta-tipo-gasto-general',
  templateUrl: './alta-tipo-gasto-general.component.html',
  styleUrls: ['./alta-tipo-gasto-general.component.scss']
})
export class AltaTipoGastoGeneralComponent implements OnInit {
  nuevoTipoGastoGeneral: TipoGastoGeneral = new TipoGastoGeneral();
  cargando: boolean = false;
  TiposDePersona = TiposDePersona;
  
  constructor(public dialogRef: MatDialogRef<AltaTipoGastoGeneralComponent>) { }

  ngOnInit() {}

  onNoClick() {
    this.dialogRef.close();
  }
}
