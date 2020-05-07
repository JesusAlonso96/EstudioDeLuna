import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';

@Component({
  selector: 'app-seleccionar-proveedor',
  templateUrl: './seleccionar-proveedor.component.html',
  styleUrls: ['./seleccionar-proveedor.component.scss']
})
export class SeleccionarProveedorComponent implements OnInit {
  proveedores: Proveedor[];
  cargando: boolean = false;
  seleccionados: boolean[] = [];
  seleccionado: Proveedor;
  constructor(public dialogRef: MatDialogRef<SeleccionarProveedorComponent>, 
    private proveedoresService: ProveedoresService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedores();
  }
  obtenerProveedores() {
    this.cargando = true;
    this.proveedoresService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.cargando = false;
        this.proveedores = proveedores;
        this.iniciarSeleccionados();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo);
      }
    );
  }
  iniciarSeleccionados() {
    for (let i = 0; i < this.proveedores.length; i++) {
      this.seleccionados[i] = false;
    }
  }
  seleccionarProveedor(proveedor: Proveedor, indice: number) {
    this.iniciarSeleccionados();
    this.seleccionados[indice] = true;
    this.seleccionado = proveedor;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  limpiarSeleccionado(){
    this.iniciarSeleccionados();
    this.seleccionado = undefined;
  }
}
