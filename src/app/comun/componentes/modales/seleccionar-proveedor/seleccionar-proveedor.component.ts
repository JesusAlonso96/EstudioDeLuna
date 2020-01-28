import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { MatDialogRef } from '@angular/material';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';

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
  constructor(public dialogRef: MatDialogRef<SeleccionarProveedorComponent>, private usuarioService: UsuarioService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerProveedores();
  }
  obtenerProveedores() {
    this.cargando = true;
    this.usuarioService.obtenerProveedores().subscribe(
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
