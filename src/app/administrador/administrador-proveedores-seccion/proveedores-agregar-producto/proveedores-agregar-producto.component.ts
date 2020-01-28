import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { SeleccionarProveedorComponent } from 'src/app/comun/componentes/modales/seleccionar-proveedor/seleccionar-proveedor.component';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ProductoProveedor } from 'src/app/comun/modelos/producto_proveedor.model';

@Component({
  selector: 'app-proveedores-agregar-producto',
  templateUrl: './proveedores-agregar-producto.component.html',
  styleUrls: ['./proveedores-agregar-producto.component.scss']
})
export class ProveedoresAgregarProductoComponent implements OnInit {
  proveedores: Proveedor[];
  cargando: boolean = false;
  proveedorSeleccionado: Proveedor;
  opcionesFiltradas: Observable<Proveedor[]>;
  producto: ProductoProveedor = new ProductoProveedor();
  controlador = new FormControl();

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerProveedores();
  }
  obtenerProveedores() {
    this.cargando = true;
    this.usuarioService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.cargando = false;
        this.proveedores = proveedores;
        this.iniciarFiltro();
      },
      (err) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  seleccionarProveedor() {
    const dialogRef = this.dialog.open(SeleccionarProveedorComponent);
    dialogRef.afterClosed().subscribe(proveedor => {
      if (proveedor) {
        this.proveedorSeleccionado = proveedor;
      }
    })
  }
  iniciarFiltro() {
    this.opcionesFiltradas = this.controlador.valueChanges
      .pipe(
        startWith(''),
        map(valor => typeof valor === 'string' ? valor : valor.nombre),
        map(nombre => nombre ? this._filtro(nombre) : this.proveedores.slice())
      );
  }
  private _filtro(nombre: string): Proveedor[] {
    return this.proveedores.filter(opcion => opcion.nombre.toLowerCase().includes(nombre.toLowerCase()));
  }
  mostrarProveedor(proveedor?: Proveedor): string | undefined {
    return proveedor ? proveedor.nombre : undefined;
  }
  agregarProducto(formulario: NgForm) {
    this.cargando = true;
    this.producto.proveedor = this.controlador.value;
    this.usuarioService.agregarProductoProveedor(this.producto).subscribe(
      (guardado: any) => {
        this.cargando = false;
        this.toastr.success(guardado.detalles, guardado.titulo, { closeButton: true });
        formulario.resetForm();
        this.controlador = new FormControl();
        this.iniciarFiltro();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
}
