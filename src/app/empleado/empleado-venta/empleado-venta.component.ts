import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormControl, NgForm, NgModel } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as momento from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Cliente } from 'src/app/comun/modelos/cliente.model';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { Pedido, ProductoPedido } from 'src/app/comun/modelos/pedido.model';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { ClienteService } from 'src/app/comun/servicios/cliente.service';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ProductosService } from '../../comun/servicios/productos.service';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { EmpleadoVentaTablaProductosAgregadosComponent } from './empleado-venta-tabla-productos-agregados/empleado-venta-tabla-productos-agregados.component';
import { ModalConfirmarCompraComponent } from './modal-confirmar-compra/modal-confirmar-compra.component';
import { ModalGenerarTicketComponent } from './modal-generar-ticket/modal-generar-ticket.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { Animaciones } from 'src/app/comun/constantes/animaciones';
import { TemasService } from 'src/app/comun/servicios/temas.service';
import { ImagenesService } from 'src/app/comun/servicios/imagenes.service';
import { EmpleadoVentaListaProductosComponent } from './empleado-venta-lista-productos/empleado-venta-lista-productos.component';
import { MatStepper } from '@angular/material';
import { ModalEmpleadoAbrirCajaComponent } from './modal-empleado-abrir-caja/modal-empleado-abrir-caja.component';
import { CajaService } from 'src/app/comun/servicios/caja.service';
import { PedidosService } from 'src/app/comun/servicios/pedidos.service';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

export interface DialogData {
  num: number,
  familia: string,
  productosActuales: ProductoPedido[];
}
export interface DialogData2 {
  crear: boolean,
  pedido: Pedido
}

@Component({
  selector: 'app-empleado-venta',
  templateUrl: './empleado-venta.component.html',
  styleUrls: ['./empleado-venta.component.scss'],
  animations: [Animaciones.deslizarAbajo, Animaciones.carga]
})
export class EmpleadoVentaComponent implements OnInit, AfterViewChecked {
  @ViewChild('tablaProductos') tablaProductos: EmpleadoVentaTablaProductosAgregadosComponent;
  @ViewChild('listaProductos') listaProductos: EmpleadoVentaListaProductosComponent;
  @ViewChild('cliente') cliente: NgModel;
  @ViewChild('stepper') stepper: MatStepper;
  eventoCambioImagen: any = '';
  imagenRecortada: any = '';
  familias: Familia[];
  pedido: Pedido = new Pedido();
  clientes: Cliente[] = [];
  clientesFiltrados: Observable<Cliente[]>;
  familiaSeleccionada: String = '';
  productos: Producto[];
  fotografosDisponibles: Usuario[];
  costoExtra: boolean = false;
  mostrarCantidades: boolean = false;
  constructor(private usuarioService: UsuarioService,
    private toastr: NgToastrService,
    private productosService: ProductosService,
    private clientesService: ClienteService,
    private empleadoService: EmpleadoService,
    public dialog: MatDialog,
    private pedidosService: PedidosService,
    private temasService: TemasService,
    private imagenesService: ImagenesService,
    private cajasService: CajaService,
    private cargandoService: CargandoService) { }
  ngAfterViewChecked(): void {

  }
  ngOnInit() {
    if (!localStorage.getItem('c_a')) this.abrirModalAbrirCaja();
    this.pedido.cliente = undefined;
    this.pedido.productos = [];
    this.obtenerFamiliasProductos();
  }
  cambioArchivoEvento(evento: any) {
    if (evento.target.value == '') {
      this.cargandoService.crearVistaCargando(false);
    } else {
      this.cargandoService.crearVistaCargando(true, 'Cargando imagen..');
      this.eventoCambioImagen = event;
    }
  }
  _imagenRecortada(evento: ImageCroppedEvent) {
    this.imagenRecortada = evento.base64;
  }
  imagenCargada() { this.cargandoService.crearVistaCargando(false); }
  cortadorListo() { this.cargandoService.crearVistaCargando(false); }
  cargarImagenFallida() { this.cargandoService.crearVistaCargando(false); }
  eliminarImagen() {
    this.imagenRecortada = '';
    this.eventoCambioImagen = '';
  }
  /* FIN DE CROPPER */
  agregarCostoExtra() {
    if (this.pedido.importante) {
      this.pedido.total += 30
      this.costoExtra = true;
      this.toastr.abrirToastr('advertencia', 'Costo extra', 'Se agregaron $30 pesos');
    } else {
      if (this.costoExtra) this.pedido.total -= 30;
    }
  }
  verificarCantidadAPagar(): { valido: boolean, mensaje?: string } {
    if (this.pedido.anticipo > this.pedido.total) return { valido: false, mensaje: 'La cantidad pagada es mayor a la del pedido' };
    else {
      if (!this.pedido.c_retoque) {
        if (this.pedido.anticipo < this.pedido.total) return { valido: false, mensaje: 'Tiene que cubrir el monto completo' }
      }
    }
    return { valido: true };
  }
  imagenValida(): { valido: boolean, mensaje?: string } {
    return this.pedido.c_retoque && this.imagenRecortada == '' ? { valido: false, mensaje: 'Por favor, selecciona una imagen' } : { valido: true }
  }
  cargandoProductos(evento) {
    this.cargandoService.crearVistaCargando(evento.cargando, evento.texto);
  }
  obtenerProductoAgregado(producto: ProductoPedido) {
    this.agregarProducto(producto);
  }
  agregarProducto(producto: ProductoPedido) {
    this.pedido.total = this.pedido.total + producto.precioUnitario;
    this.pedido.productos.push(producto);
    this.tablaProductos.datosProductos.data = this.pedido.productos;
    this.pedido.c_retoque = this.tieneRetoque();
    this.pedido.c_adherible = this.llevaAdherible();
  }
  obtenerTotalPedido() {
    let total = 0;
    this.pedido.productos.forEach((producto) => {
      total = total + (producto.cantidad * producto.precioUnitario);
    })
    this.pedido.total = total;
    this.mostrarCantidades = true;
  }
  existeEnProductos(producto: ProductoPedido): boolean {
    for (let i = 0; i < this.productos.length; i++) {
      if (producto.producto._id == this.pedido.productos[i].producto._id) return true;
    }
    return false;
  }
  listaProductosValida(): boolean {
    return this.pedido.productos.length > 0 ? true : false;
  }
  mostrarCliente(cliente: Cliente): string {
    return cliente && cliente.nombre + ' ' + cliente.ape_pat ? cliente.nombre + ' ' + cliente.ape_pat : '';
  }
  obtenerClientes() {
    this.clientesService.obtenerClientes().subscribe(
      (clientes: Cliente[]) => {
        this.clientes = clientes;
        this.clientesFiltrados = this.cliente.valueChanges
          .pipe(
            startWith(''),
            map(valor => typeof valor == 'string' ? valor : valor.nombre),
            map(cliente => cliente ? this._clientesFiltrados(cliente) : this.clientes.slice())
          );
      }
    );
  }
  private _clientesFiltrados(value: string): Cliente[] {
    return this.clientes.filter(cliente => cliente.nombre.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }
  obtenerFamiliasProductos() {
    this.cargandoService.crearVistaCargando(true, 'Obteniendo familias...')
    this.productosService.obtenerFamiliasProductos().subscribe(
      (familias) => {
        this.familias = familias;
        this.cargandoService.crearVistaCargando(false);
      },
      (err) => {
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
        this.cargandoService.crearVistaCargando(false);
      }
    )
  }
  crearImagen(idPedido: string) {
    this.cargandoService.crearVistaCargando(true, 'Subiendo imagen...');
    const imagen = this.imagenesService.convertirImagen(this.imagenRecortada);
    const img = new FormData();
    img.append('imagen', imagen);
    this.empleadoService.crearFoto(img, idPedido).subscribe(
      (pedido: Pedido) => {
        this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
      }
    );
  }
  tieneRetoque(): boolean {
    return this.pedido.productos.find(producto => producto.producto.c_r) ? true : false;
  }
  llevaAdherible(): boolean {
    return this.pedido.productos.find(producto => producto.producto.c_ad) ? true : false;
  }
  generarFechaEntrega() {
    if (this.pedido.c_retoque) { // si tiene retoque
      this.pedido.fecha_creacion = new Date(Date.now());
      if (this.pedido.importante) { //si tiene retoque y es un pedido importante
        //si es sabado no se cierra a medio dia
        if (momento(this.pedido.fecha_creacion).day() == 6) { //si es sabado se agrega la hora normal
          this.pedido.fecha_entrega = momento(this.pedido.fecha_creacion).add(60, 'm').toDate();
        } else {
          var aux = momento(this.pedido.fecha_creacion).add(60, 'm').toDate();
          if (aux.getHours() >= 14 && aux.getHours() <= 15) {//si es mayor a las dos pero menor que las 3
            aux.setHours(16);
            aux.setMinutes(0);
            aux.setSeconds(0);
            this.pedido.fecha_entrega = aux;
          } else if (aux.getHours() >= 20) {
            aux.setHours(12);
            aux.setMinutes(0);
            aux.setSeconds(0);
            aux = momento(this.pedido.fecha_creacion).add(1, 'days').toDate();
          } else {
            this.pedido.fecha_entrega = momento(this.pedido.fecha_creacion).add(60, 'm').toDate();
          }
        }
      } else {
        //si no es importante y es sabado
        let domingo = momento(this.pedido.fecha_creacion).add(1, 'days');
        //si el siguiente dia es domingo se recorre al lunes
        if (domingo.day() == 0) {
          var a = momento(this.pedido.fecha_creacion).add(2, 'days').toDate();
        } else {
          var a = momento(this.pedido.fecha_creacion).add(1, 'days').toDate();
        }
        a.setMinutes(0);
        a.setSeconds(0);
        if (a.getHours() < 14) {
          a.setHours(12);
        } else if (a.getHours() >= 14) {
          a.setHours(18);
        }
        this.pedido.fecha_entrega = a;
      }
    } else {
      this.pedido.fecha_creacion = new Date(Date.now());
      this.pedido.fecha_entrega = momento(this.pedido.fecha_creacion).add(15, 'm').toDate();
    }
    return true;
  }
  asignarFotografoAleatorio(num_fotografos: number, fotografos: Usuario[]) {
    this.pedido.fotografo = fotografos[(Math.floor(Math.random() * num_fotografos) + 0)];
  }
  reiniciarFormularios(detallesForm: NgForm, completarForm: NgForm) {
    this.stepper.previous(); this.stepper.previous();
    detallesForm.resetForm();
    completarForm.resetForm();
    this.pedido.productos = [];
    this.tablaProductos.datosProductos.data = this.pedido.productos;
    this.pedido.total = 0;
    this.imagenRecortada = '';
    this.eventoCambioImagen = '';
  }
  asignarFotografo(detallesForm: NgForm, completarForm: NgForm) {
    if (this.pedido.c_retoque) {
      this.abrirModalPedido(detallesForm, completarForm);
    } else {
      this.cargandoService.crearVistaCargando(true, 'Asignando fotografo...');
      var hoy = new Date(Date.now());
      this.empleadoService.asignarFotografoLibre(momento(hoy).format('YYYY-MM-DD')).subscribe(
        (fotografos) => {
          this.asignarFotografoAleatorio(fotografos.length, fotografos);
          this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('exito', 'El pedido sera realizado por ' + this.pedido.fotografo.nombre, '');
          this.abrirModalPedido(detallesForm, completarForm);
        },
        (err: HttpErrorResponse) => {
          if (err.error.titulo == 'No hay ningun fotografo desocupado') {
            this.pedidosService.numPedidosFotografo().subscribe(
              (idFotografo: string) => {
                this.usuarioService.obtenerUsuario(idFotografo !== '' ? idFotografo : '').subscribe(
                  (fotografo: Usuario) => {
                    this.pedido.fotografo = fotografo;
                    this.toastr.abrirToastr('exito', 'El pedido sera realizado por ' + this.pedido.fotografo.nombre, '');
                    this.abrirModalPedido(detallesForm, completarForm);
                  },
                  (err: HttpErrorResponse) => {
                    if (err.error.detalles == 'No se encontro el usuario solicitado') this.toastr.abrirToastr('error', 'Sin fotografos', 'El pedido no se puede realizar debido a que no existen empleados disponibles');
                  }
                );
                this.cargandoService.crearVistaCargando(false);
              },
              (err: HttpErrorResponse) => {
                this.toastr.abrirToastr('error', err.error.titulo, err.error.detalles);
                this.cargandoService.crearVistaCargando(false);
              }
            );
          }
        }
      );
    }
  }

  crearVenta(pedidoCreado: Pedido) {
    if (!this.pedido.c_retoque) {
      this.cargandoService.crearVistaCargando(true, 'Creando venta...');
      this.empleadoService.crearVenta(pedidoCreado, pedidoCreado.total, pedidoCreado.metodoPago, localStorage.getItem('c_a')).subscribe(
        (ok: any) => {
          this.cargandoService.crearVistaCargando(false);
        },
        (err: HttpErrorResponse) => {
          this.cargandoService.crearVistaCargando(false);
          this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
        });
    } else this.cajasService.actualizarCaja(localStorage.getItem('c_a'), { cantidad: pedidoCreado.anticipo, metodoPago: pedidoCreado.metodoPago }).subscribe();
  }
  crearPedido(detallesForm: NgForm, completarForm: NgForm) {
    this.cargandoService.crearVistaCargando(true, 'Creando pedido...');
    this.pedidosService.crearPedido(this.pedido, this.pedido.fotografo._id).subscribe(
      (pedidoCreado: Pedido) => {
        //socket aqui
        if (this.imagenRecortada) {
          this.crearImagen(pedidoCreado._id);
        }
        this.crearVenta(pedidoCreado);
        this.mandarNotificaciones(pedidoCreado);
        this.abrirModalTicket(pedidoCreado);
        this.toastr.abrirToastr('exito', 'El pedido ha sido creado con exito', 'Pedido creado');
        this.reiniciarFormularios(detallesForm, completarForm);
        this.cargandoService.crearVistaCargando(false);
      },
      (err: HttpErrorResponse) => {
        this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  mandarNotificaciones(pedido: Pedido) {
    this.pedidosService.mandarNotificaciones(pedido);
  }
  //MODALES
  abrirModalTicket(pedidoCreado) {
    this.dialog.open(ModalGenerarTicketComponent, {
      data: { pedido: pedidoCreado }
    });
  }
  abrirModalPedido(detallesForm: NgForm, completarForm: NgForm) {
    const dialogRef = this.dialog.open(ModalConfirmarCompraComponent, {
      data: this.pedido,
      panelClass: this.temasService.obtenerClaseActiva(),
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(crear => {
      if (crear) {
        this.crearPedido(detallesForm, completarForm);
      }
    })
  }
  abrirModalAbrirCaja() {
    this.dialog.open(ModalEmpleadoAbrirCajaComponent, {
      panelClass: this.temasService.obtenerClaseActiva(),
      disableClose: true
    })
  }

  abrirCrearPedido(detallesForm: NgForm, completarForm: NgForm) {
    this.generarFechaEntrega();
    this.asignarFotografo(detallesForm, completarForm);
  }
  prueba() {
    console.log(this.pedido);
  }

}

//MODALES
export interface Error {
  titulo: string;
  detalles: string;
}
@Component({
  selector: 'modal',
  templateUrl: 'modal.html',
  styleUrls: ['modal.scss']
})
export class Modal {
  buscador: boolean = false;
  productoBuscar: any;
  error: Error;
  productosPedido: ProductoPedido[] = [];
  constructor(
    public dialogRef: MatDialogRef<Modal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private productoService: ProductosService) {
    this.productoBuscar = new Producto();
    this.productoBuscar.num_fotos = this.data.num;
    this.productoBuscar.familia = this.data.familia;
    this.buscador = false;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  buscar() {
    this.error = null;
    this.buscador = true;
    this.productoService.buscarProducto(this.productoBuscar).subscribe(
      (productos: Producto[]) => {
        this.buscador = false;
        this.productosPedido = [];
        this.iniciarProductosPedido(productos);
      },
      (err: HttpErrorResponse) => {
        this.error = err.error;
        this.buscador = false;
        this.productosPedido = [];
      }
    )
  }
  agregarProducto(productoPedido: ProductoPedido) {
    productoPedido.cantidad += 1;
    this.dialogRef.close(productoPedido);
  }
  iniciarProductosPedido(productos: Producto[]) {
    for (let producto of productos) {
      this.productosPedido.push(ProductoPedido.prototype.nuevoProducto(producto, 0, producto.precio));
    }
  }
  existeEnProductos(producto: ProductoPedido): boolean {
    for (let i = 0; i < this.data.productosActuales.length; i++) {
      if (producto.producto._id == this.data.productosActuales[i].producto._id) return true;
    }
    return false;
  }


}
