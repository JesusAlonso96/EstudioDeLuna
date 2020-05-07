import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CajaService } from 'src/app/comun/servicios/caja.service';
import { Caja } from 'src/app/comun/modelos/caja.model';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';

@Component({
  selector: 'app-modal-empleado-abrir-caja',
  templateUrl: './modal-empleado-abrir-caja.component.html',
  styleUrls: ['./modal-empleado-abrir-caja.component.scss']
})
export class ModalEmpleadoAbrirCajaComponent implements OnInit {
  @ViewChild('cajaSeleccionada2') cajaSeleccionada2: NgModel;
  cajaSeleccionada: Caja;
  cajasDisponibles: Caja[] = [];
  cajasFiltradas: Observable<Caja[]>;
  cargando: boolean = false;
  constructor(public dialogRef: MatDialogRef<ModalEmpleadoAbrirCajaComponent>,
    private cajasService: CajaService,
    private toastr: NgToastrService) { }

  ngOnInit(): void {
    this.obtenerCajasDisponibles();
  }

  obtenerCajasDisponibles() {
    this.cargando = true;
    this.cajasService.obtenerCajasDesocupadas().subscribe(
      (cajas: Caja[]) => {
        this.cargando = false;
        this.cajasDisponibles = cajas;
        this.cajasFiltradas = this.cajaSeleccionada2.valueChanges
          .pipe(
            startWith(''),
            map(valor => typeof valor == 'string' ? valor : valor.id),
            map(caja => caja ? this._cajasFiltradas(caja) : this.cajasDisponibles.slice())
          );
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  abrirCaja() {
    this.cargando = true;
    console.log(this.cajaSeleccionada._id)
    this.cajasService.abrirCaja(this.cajaSeleccionada._id).subscribe(
      (resp: Mensaje) => {
        this.cargando = false;
        this.toastr.abrirToastr('exito', resp.titulo, '');
        localStorage.setItem('c_a', this.cajaSeleccionada._id);
        this.dialogRef.close();
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  private _cajasFiltradas(id: string): Caja[] {
    const idNumero: number = Number(id);
    return this.cajasDisponibles.filter(caja => caja.id == idNumero);
  }
  mostrarCaja(caja: Caja): string {
    return caja && String(caja.id) ? String(caja.id) : '';
  }
}
