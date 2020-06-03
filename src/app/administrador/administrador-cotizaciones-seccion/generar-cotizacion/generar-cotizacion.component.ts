import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { ServicioAutenticacionService } from 'src/app/autenticacion/servicio-autenticacion/servicio-autenticacion.service';
import { ModalConfirmacionComponent } from 'src/app/comun/componentes/modal-confirmacion/modal-confirmacion.component';
import { VerCotizacionComponent } from 'src/app/comun/componentes/modales/ver-cotizacion/ver-cotizacion.component';
import { Cotizacion } from 'src/app/comun/modelos/cotizacion.model';
import { EmpresaCot } from 'src/app/comun/modelos/empresa_cot.model';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { ProductoCot } from 'src/app/comun/modelos/producto_cot.model';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';
import { CotizacionesService } from 'src/app/comun/servicios/cotizaciones.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { ProductosService } from 'src/app/comun/servicios/productos.service';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { CotizacionListaProductosComponent } from './cotizacion-lista-productos/cotizacion-lista-productos.component';

@Component({
  selector: 'app-generar-cotizacion',
  templateUrl: './generar-cotizacion.component.html',
  styleUrls: ['./generar-cotizacion.component.scss']
})
export class GenerarCotizacionComponent implements OnInit {
  @ViewChild('listaProductos') listaProductos: CotizacionListaProductosComponent;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('datosGeneralesForm') datosGeneralesForm: NgForm;
  vigencias: number[] = [];
  empresas: EmpresaCot[] = [];
  cotizacion: Cotizacion = new Cotizacion();
  productos_cot: ProductoCot[] = [];
  familiaSeleccionada: Familia = new Familia();
  familiasProductos: Familia[] = [];
  editarManual: boolean = false;
  fechaEmpiezaEn: Date = new Date(Date.now());
  datosTabla: MatTableDataSource<Producto>;
  mostrarCotizacion: boolean = false;
  constructor(private usuarioService: UsuarioService,
    private cotizacionService: CotizacionesService,
    private toastr: NgToastrService,
    private productosService: ProductosService,
    private autService: ServicioAutenticacionService,
    private dialog: MatDialog,
    private cargandoService: CargandoService) { }

  ngOnInit() {
    this.obtenerEmpresas();
    this.inicializarVigencias();
  }
  obtenerEmpresas() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo empresas...')
    this.cotizacionService.obtenerEmpresas().subscribe(
      (empresas: EmpresaCot[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.empresas = empresas;
        this.generarAsesorCotizacion();
        this.obtenerFamiliasProductos();
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  obtenerFamiliasProductos() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo familias de productos...')
    this.productosService.obtenerFamiliasProductos().subscribe(
      (familias: Familia[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.familiasProductos = familias;
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  buscarProductosPorFamilia() {
    this.cargandoService.crearVistaCargando(true, 'Buscando productos...')
    this.productosService.obtenerProductos(this.familiaSeleccionada._id).subscribe(
      (productos: Producto[]) => {
        this.cargandoService.crearVistaCargando(false);
        this.iniciarProductosCotizacion(productos);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  iniciarProductosCotizacion(productos: Producto[]) {
    this.productos_cot = [];
    for (let producto of productos) {
      this.productos_cot.push(ProductoCot.prototype.nuevoProducto(producto, 0, producto.precio));
    }
  }
  cantidadIgualCero(producto: ProductoCot): boolean {
    if (producto.cantidad == 0) return true;
    return false;
  }
  generarCantidadesCotizacion() {
    this.cotizacion.subtotal = this.cotizacion.total = this.cotizacion.iva = 0;
    for (let producto of this.cotizacion.productos) {
      this.cotizacion.subtotal = this.cotizacion.subtotal + (producto.cantidad * producto.precioUnitario);
    }
    this.cotizacion.iva = this.cotizacion.subtotal * .16;
    this.cotizacion.total = this.cotizacion.subtotal + this.cotizacion.iva;
    this.mostrarCotizacionGenerada();
  }
  generarAsesorCotizacion() {
    this.usuarioService.obtenerUsuario(this.autService.getIdUsuario()).subscribe(
      (asesor: Usuario) => {
        this.cotizacion.asesor = asesor;
      },
      (err: HttpErrorResponse) => {
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }

  eligioControladorValido(controlador: FormControl): boolean {
    return controlador.status == 'VALID' ? true : false;
  }
  abrirConfirmacionCotizacion() {
    const referenciaModal = this.dialog.open(ModalConfirmacionComponent, {
      data: { titulo: 'Generar cotizacion', mensaje: '¿Desea crear esta cotizacion?', msgBoton: 'Crear', color: 'warn' }
    })
    referenciaModal.afterClosed().subscribe(respuesta => {
      if (respuesta) this.generarCotizacion();
    })
  }
  generarCotizacion() {
    this.cargandoService.crearVistaCargando(true, 'Creando cotizacion...')
    this.cotizacionService.agregarCotizacion(this.cotizacion).subscribe(
      (cotizacion: Cotizacion) => {
        this.cargandoService.crearVistaCargando(false);
        this.reiniciarCotizacion();
        this.toastr.abrirToastr('exito', 'Cotizacion creada', 'Se creo exitosamente la cotizacion');
        this.dialog.open(VerCotizacionComponent, {
          data: cotizacion
        });
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  reiniciarCotizacion() {
    this.stepper.previous();
    this.stepper.previous();
    this.mostrarCotizacion = false;
    this.datosGeneralesForm.resetForm();
    this.cotizacion = new Cotizacion();
    this.familiaSeleccionada = new Familia();
    this.productos_cot = [];
    this.generarAsesorCotizacion();
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
  mostrarCotizacionGenerada() {
    if (this.listaProductosValida()) this.mostrarCotizacion = !this.mostrarCotizacion;
  }
}
