import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { Observable } from 'rxjs';
import { ProductoProveedor } from 'src/app/comun/modelos/producto_proveedor.model';
import { FormControl, NgForm } from '@angular/forms';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { MatDialog } from '@angular/material';
import { SeleccionarProveedorComponent } from 'src/app/comun/componentes/modales/seleccionar-proveedor/seleccionar-proveedor.component';
import { startWith, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-root-proveedores-insumo-alta',
  templateUrl: './root-proveedores-insumo-alta.component.html',
  styleUrls: ['./root-proveedores-insumo-alta.component.scss']
})
export class RootProveedoresInsumoAltaComponent implements OnInit {
  proveedores: Proveedor[];
  proveedorSeleccionado: Proveedor;
  opcionesFiltradas: Observable<Proveedor[]>;
  producto: ProductoProveedor = new ProductoProveedor();
  controlador = new FormControl();
  constructor(
    private proveedoresService: ProveedoresService,
    private toastr: NgToastrService,
    private dialog: MatDialog,
    private cargandoService: CargandoService) { }

  ngOnInit(): void {
    this.obtenerProveedores();
  }
  obtenerProveedores() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo proveedores..')
    this.proveedoresService.obtenerProveedores().subscribe(
      (proveedores: Proveedor[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.proveedores = proveedores;
        this.iniciarFiltro();
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
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
    this.cargandoService.crearVistaCargando(true, 'Agregando producto...')
    this.producto.proveedor = this.controlador.value;
    this.proveedoresService.agregarProductoProveedor(this.producto).subscribe(
      (guardado: any) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('exito', guardado.titulo, guardado.detalles);
        formulario.resetForm();
        this.controlador = new FormControl();
        this.iniciarFiltro();
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
}
