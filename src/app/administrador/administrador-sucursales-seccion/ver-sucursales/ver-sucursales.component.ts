import { Component, OnInit } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-ver-sucursales',
  templateUrl: './ver-sucursales.component.html',
  styleUrls: ['./ver-sucursales.component.scss']
})
export class VerSucursalesComponent implements OnInit {
  lista: MatSnackBar[] = [];
  constructor(private snack: MatSnackBar) { }

  ngOnInit() {
  }
  abrir() {
    
    
    this.lista.push(this.snack);
    //this.snack.open('Hola', 'cerrar', config);
  }
  cerrar(){
    let config = new MatSnackBarConfig();
    config.verticalPosition = 'top';
    config.horizontalPosition = 'end';
    config.duration = 2000;
    console.log(this.lista)
    for (let snack of this.lista){
      snack.open('Hola', 'cerrar', config)
    }
  }
}
