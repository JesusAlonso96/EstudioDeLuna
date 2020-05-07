import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { VerCotizacionComponent } from 'src/app/comun/componentes/modales/ver-cotizacion/ver-cotizacion.component';
import { Cotizacion } from 'src/app/comun/modelos/cotizacion.model';
import { DatosEstudio } from 'src/app/comun/modelos/datos_estudio.model';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { ProductoCot } from 'src/app/comun/modelos/producto_cot.model';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { ProductosService } from 'src/app/comun/servicios/productos.service';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { Mensaje } from 'src/app/comun/modelos/mensaje.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CotizacionListaProductosComponent } from './cotizacion-lista-productos/cotizacion-lista-productos.component';

@Component({
  selector: 'app-generar-cotizacion',
  templateUrl: './generar-cotizacion.component.html',
  styleUrls: ['./generar-cotizacion.component.scss']
})
export class GenerarCotizacionComponent implements OnInit {
  @ViewChild('listaProductos') listaProductos: CotizacionListaProductosComponent; 
  @ViewChild('empresa') empresa: NgModel;
  vigencias: number[] = [];
  cargando: boolean = false;
  empresas: EmpresaCot[] = [];
  empresasFiltradas: Observable<EmpresaCot[]>;
  cotizacion: Cotizacion = new Cotizacion();
  productos_cot: ProductoCot[] = [];
  familiaSeleccionada: Familia = new Familia();
  familiasProductos: Familia[] = [];
  editarManual: boolean = false;
  fechaEmpiezaEn: Date = new Date(Date.now());
  datosTabla: MatTableDataSource<Producto>;
  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private productosService: ProductosService, private autService: ServicioAutenticacionService, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerEmpresas();
    this.inicializarVigencias();
  }
  obtenerDatosEstudio() {
    this.cargando = true;
    this.usuarioService.obtenerDatosEstudio().subscribe(
      (datos: DatosEstudio) => {
        this.cargando = false;
        this.cotizacion.datos = datos;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerEmpresas() {
    this.cargando = true;
    this.usuarioService.obtenerEmpresas().subscribe(
      (empresas: EmpresaCot[]) => {
        this.cargando = false;
        this.empresas = empresas;
        this.obtenerDatosEstudio();
        this.generarAsesorCotizacion();
        this.iniciarFiltro();
        this.obtenerFamiliasProductos();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerFamiliasProductos() {
    this.cargando = true;
    this.productosService.obtenerFamiliasProductos().subscribe(
      (familias: Familia[]) => {
        this.cargando = false;
        this.familiasProductos = familias;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  //filtro de empresas
  iniciarFiltro() {
    this.empresasFiltradas = this.empresa.valueChanges
      .pipe(
        startWith(''),
        map(valor => typeof valor === 'string' ? valor : valor.nombre),
        map(nombre => nombre ? this._filtro(nombre) : this.empresas.slice())
      );
  }
  private _filtro(nombre: string): EmpresaCot[] {
    return this.empresas.filter(opcion => opcion.nombre.toLowerCase().includes(nombre.toLowerCase()));
  }
  mostrarEmpresa(empresa?: EmpresaCot) {
    return empresa ? empresa.nombre : undefined;
  }
  buscarProductosPorFamilia() {
    this.cargando = true;
    this.productosService.obtenerProductos(this.familiaSeleccionada._id).subscribe(
      (productos: Producto[]) => {
        this.cargando = false;
        this.iniciarProductosCotizacion(productos);
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  iniciarProductosCotizacion(productos: Producto[]) {
    this.productos_cot = [];
    for (let producto of productos) {
      this.productos_cot.push(ProductoCot.prototype.nuevoProducto(producto, 0));
    }
  }
  agregarCantidadProducto(producto: ProductoCot) {
    this.agregarProducto(producto);
  }
  quitarCantidadProducto(producto: ProductoCot) {
    producto.cantidad -= 1;
    this.quitarProducto(producto);
  }
  cantidadIgualCero(producto: ProductoCot): boolean {
    if (producto.cantidad == 0) return true;
    return false;
  }
  agregarProducto(productoCot: ProductoCot) {
    if (productoCot.cantidad == 1) {
      if (!this.listaProductos.existeProducto(productoCot)) {
        this.cotizacion.productos.push(productoCot);
      }
    }
  }
  quitarProducto(productoCot: ProductoCot) {
    if (productoCot.cantidad == 0) {
      const indice = this.cotizacion.productos.indexOf(productoCot);
      this.cotizacion.productos.splice(indice, 1);
    }
  }
  editarCantidadesManualmente(productoCot: ProductoCot) {
    this.quitarProducto(productoCot);
  }
  crearFechaCotizacion() {
    this.cotizacion.fecha = new Date(Date.now());
  }
  generarCantidadesCotizacion() {
    for (let producto of this.cotizacion.productos) {
      this.cotizacion.subtotal = this.cotizacion.subtotal + (producto.cantidad * <number>producto.producto.precio);
    }
    this.cotizacion.iva = this.cotizacion.subtotal * .16;
    this.cotizacion.total = this.cotizacion.subtotal + this.cotizacion.iva;
  }
  generarAsesorCotizacion() {
    this.cargando = true;
    this.usuarioService.obtenerUsuario(this.autService.getIdUsuario()).subscribe(
      (asesor: Usuario) => {
        this.cargando = false;
        this.cotizacion.asesor = asesor;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }

  eligioProductos(): boolean {
    return this.cotizacion.productos.length > 0 ? true : false;
  }
  eligioControladorValido(controlador: FormControl): boolean {
    return controlador.status == 'VALID' ? true : false;
  }
  abrirCotizacion() {
    if (this.eligioProductos()) {
      this.cotizacion.empresa = this.empresa.value;
      this.crearFechaCotizacion();
      this.generarCantidadesCotizacion();
      this.generarCotizacion();
    } else {
      this.toastr.error('Cotización no generada', 'Por favor, completa todos los datos', { closeButton: true });
    }
  }
  generarCotizacion() {
    this.cargando = true;
    this.usuarioService.agregarCotizacion(this.cotizacion).subscribe(
      (guardada: Mensaje) => {
        this.cargando = false;
        this.toastr.success(guardada.detalles, guardada.titulo, { closeButton: true });
        const dialogRef = this.dialog.open(VerCotizacionComponent, {
          data: this.cotizacion
        });
        dialogRef.afterClosed().subscribe(r => {
          this.cotizacion = new Cotizacion();
        })
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );

  }
 
  listaProductosValida(): boolean {
    return this.cotizacion.productos.length > 0 ? true : false;
  }
  inicializarVigencias() {
    const anioVigente = new Date().getFullYear();
    for (let i = 0; i < 2; i++) {
      this.vigencias.push(anioVigente + i);
    }
  }
}
