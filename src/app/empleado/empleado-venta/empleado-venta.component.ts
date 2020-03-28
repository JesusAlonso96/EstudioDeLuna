import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as momento from 'moment';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Cliente } from 'src/app/comun/modelos/cliente.model';
import { Familia } from 'src/app/comun/modelos/familia.model';
import { Pedido } from 'src/app/comun/modelos/pedido.model';
import { Producto } from 'src/app/comun/modelos/producto.model';
import { Usuario } from 'src/app/comun/modelos/usuario.model';
import { ClienteService } from 'src/app/comun/servicios/cliente.service';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ProductosService } from '../../comun/servicios/productos.service';
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { PedidosService } from '../servicio-empleado/pedidos.service';
import { ModalConfirmarCompraComponent } from './modal-confirmar-compra/modal-confirmar-compra.component';
import { ModalDetallesProductoComponent } from './modal-detalles-producto/modal-detalles-producto.component';
import { ModaDetallesTamComponent } from './modal-detalles-tam/modal-detalles-tam.component';
import { ModalGenerarTicketComponent } from './modal-generar-ticket/modal-generar-ticket.component';

export interface DialogData {
  num: number,
  familia: string
}
export interface DialogData2 {
  crear: boolean,
  pedido: Pedido
}

@Component({
  selector: 'app-empleado-venta',
  templateUrl: './empleado-venta.component.html',
  styleUrls: ['./empleado-venta.component.scss']
})
export class EmpleadoVentaComponent implements OnInit {
  //
  imagen2: any;
  //
  familias: Familia[];
  pedido: Pedido = new Pedido();
  clientes: Cliente[] = [];
  clientesFiltrados: Observable<Cliente[]>;
  clienteCtrl = new FormControl();
  familiaSeleccionada: String = '';
  productos: Producto[];
  fecha_creacion: string = '';
  fecha_entrega: string = '';
  fotografosDisponibles: Usuario[];
  cargando: boolean = false;
  cargandoFotografo: boolean = false;
  cargandoPedido: boolean = false;
  grupo: any[];
  num_fotos: number;
  pagado: number;
  imagen: any;
  pedidoCreado: Pedido = new Pedido();
  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private productosService: ProductosService, private clientesService: ClienteService, private empleadoService: EmpleadoService, public dialog: MatDialog, private imageCompress: NgxImageCompressService, private pedidosService: PedidosService) { }

  ngOnInit() {
    this.obtenerFamiliasProductos();
    this.obtenerClientes();
  }
  obtenerClientes() {
    this.clientesService.obtenerClientes().subscribe(
      (clientes) => {
        this.clientes = clientes;
      }
    );
    this.clientesFiltrados = this.clienteCtrl.valueChanges
      .pipe(
        startWith(''),
        map(cliente => cliente ? this._clientesFiltrados(cliente) : this.clientes.slice())
      );
  }
  obtenerFamiliasProductos() {
    this.cargando = true;
    this.productosService.obtenerFamiliasProductos().subscribe(
      (familias) => {
        this.familias = familias;
        this.cargando = false;
      },
      (err) => {
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        this.cargando = false;
      }
    )
  }
  private _clientesFiltrados(value: string): Cliente[] {
    return this.clientes.filter(cliente => cliente.nombre.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }
  obtenerProductosPorCantidad(idFamilia:string) {
    this.cargando = true;
    this.productosService.obtenerProductosPorCantidad(idFamilia).subscribe(
      (respuesta: any) => {
        this.grupo = respuesta;
        this.cargando = false;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    )
  }
  obtenerProductosPorTam(idFamilia: string) {
    this.cargando = true;
    this.productosService.obtenerProductosPorTam(idFamilia).subscribe(
      (respuesta: any) => {
        this.grupo = respuesta;
        this.cargando = false;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerProductosEspeciales(idFamilia) {
    this.cargando = true;
    this.productosService.obtenerProductos(idFamilia).subscribe(
      (productos: any) => {
        this.grupo = productos;
        this.cargando = false;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  obtenerProductos(nombreFamilia, idFamilia) {
    this.grupo = [];
    this.familiaSeleccionada = nombreFamilia;
    if (this.esFamiliaEspecial()) {
      if (this.familiaSeleccionada == 'Sesiones') {
        this.obtenerProductosPorTam(idFamilia);
      } else {
        this.obtenerProductosEspeciales(idFamilia);
      }
    } else {
      this.obtenerProductosPorCantidad(idFamilia);
    }
  }
  esFamiliaEspecial(): boolean {
    if (this.familiaSeleccionada == 'Filiacion' || this.familiaSeleccionada == 'Pasaporte' || this.familiaSeleccionada == 'Visas' || this.familiaSeleccionada == 'Universidades' || this.familiaSeleccionada == 'Visas' || this.familiaSeleccionada == 'Sesiones' || this.familiaSeleccionada == 'Instituciones' || this.familiaSeleccionada == 'Combinadas') return true;
    return false
  }
  pedidoValido() {
    if (this.pedido.c_retoque) {
      this.pedido.status = 'En espera';
      if (this.pedido.importante) {
        this.pedido.total = <number>this.pedido.total + 30;
        if (this.pagado > this.pedido.total) {
          this.pedido.total = <number>this.pedido.total - 30;
          this.toastr.error("El anticipo es mayor al total del pedido");
          return false;
        }
        this.toastr.warning("Se agregaron $30 pesos por ser pedido urgente");
      } else {
        if (this.pagado > this.pedido.total) {
          this.toastr.error("El anticipo es mayor al total del pedido");
          return false;
        }
      }
    } else {
      this.pedido.status = 'Finalizado';
      if (!this.montoValido()) return false;
    }
    return true;
  }
  montoValido(): boolean {
    if (this.pagado < this.pedido.total || this.pagado > this.pedido.total) {
      this.toastr.error("Debes cubrir el monto exacto", '', { closeButton: true });
      return false;
    }
    return true;
  }
  obtenerCliente() {
    if (this.clienteCtrl.value !== null && this.clienteCtrl.value !== '') {
      var valores = this.clienteCtrl.value;
      var separado = valores.split(" | ", 2);
      this.clientesService.obtenerClientePorEmailYNombre(separado[0], separado[1]).subscribe(
        (cliente) => {
          this.pedido.cliente = cliente;
        },
        (err) => {
          this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        }
      );
    } else {
      this.pedido.cliente = null;
    }
    return true;
  }
  tieneRetoque(): boolean {
    for (let p of this.pedido.productos) {
      if (p.c_r) {
        return true;
      }
    }
    return false;
  }
  llevaAdherible(): boolean {
    for (let p of this.pedido.productos) {
      if (p.c_ad) {
        return true;
      }
    }
    return false;
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
          if (aux.getHours() >= 14) {
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
    this.fecha_creacion = momento(this.pedido.fecha_creacion).locale('es').format('LLLL');
    this.fecha_entrega = momento(this.pedido.fecha_entrega).locale('es').format('LLLL');
    return true;
  }
  asignarFotografoAleatorio(num_fotografos, fotografos) {
    var random = Math.floor(Math.random() * num_fotografos) + 0;
    this.pedido.fotografo = fotografos[random];
  }
  asignarFotografo() {
    if (this.pedido.c_retoque) {
      this.pedido.fotografo._id = undefined;
      this.abrirModalPedido();
    } else {
      this.cargandoFotografo = true;
      var hoy = new Date(Date.now());
      this.empleadoService.asignarFotografoLibre(momento(hoy).format('YYYY-MM-DD')).subscribe(
        (fotografos) => {
          this.asignarFotografoAleatorio(fotografos.length, fotografos);
          this.cargandoFotografo = false;
          this.toastr.success('El pedido sera realizado por ' + <string>this.pedido.fotografo.nombre);
          this.abrirModalPedido();
          return true;
        },
        (err) => {
          if (err.error.titulo == 'No hay ningun fotografo desocupado') {
            this.empleadoService.numPedidosFotografo().subscribe(
              (idFotografo: string) => {
                this.usuarioService.obtenerUsuario(idFotografo !== '' ? idFotografo : '').subscribe(
                  (fotografo: Usuario) => {
                    this.pedido.fotografo = fotografo;
                    this.toastr.success('El pedido sera realizado por ' + <string>this.pedido.fotografo.nombre);
                  },
                  (err: any) => {
                    this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
                  }
                );
                this.cargandoFotografo = false;
              },
              (err) => {
                this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
                this.cargandoFotografo = false;
              }
            );
            this.abrirModalPedido();
            return false;
          }
        }
      );
    }
    return true;
  }
  quitarProducto(item) {
    const indice = this.pedido.productos.indexOf(item);
    this.pedido.total = <any>this.pedido.total - <any>this.pedido.productos[indice].precio;
    this.pedido.productos.splice(indice, 1);
    this.pedido.c_retoque = this.tieneRetoque();
    this.pedido.importante = false;
  }
  asignarValoresDefault() {
    if (this.pedido.c_retoque) {
      this.pedido.status = 'En espera';
    } else {
      this.pedido.status = 'Finalizado';
    }
    this.pedido.anticipo = this.pagado;
    return true;
  }
  crearVenta(pedidoCreado: Pedido) {
    if (!this.pedido.c_retoque) {
      this.empleadoService.crearVenta(pedidoCreado, pedidoCreado.anticipo, pedidoCreado.metodoPago).subscribe(
        (ok: any) => {

        },
        (err: any) => {
          this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
        });
    } else {
      this.empleadoService.actualizarCaja(pedidoCreado.anticipo, pedidoCreado.metodoPago).subscribe();
    }
  }
  crearPedido() {
    this.cargandoPedido = true;
    this.empleadoService.crearPedido(this.pedido, this.pedido.fotografo._id).subscribe(
      (pedidoCreado: Pedido) => {
        if (this.imagen) {
          this.subirImagen(pedidoCreado._id);
        }
        //socket aqui
        this.crearVenta(pedidoCreado);
        this.mandarNotificaciones(pedidoCreado);
        this.abrirModalTicket(pedidoCreado);
        this.toastr.success('El pedido ha sido creado con exito', 'Pedido creado', { closeButton: true });
        this.cargandoPedido = false;
        this.pedido = new Pedido();
        this.pagado = 0;
      },
      (err: any) => {
        this.cargandoPedido = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
      }
    );
  }
  agregarProducto(producto) {
    this.pedido.total = this.pedido.total + producto.precio;
    this.pedido.productos.push(producto);
    this.pedido.c_retoque = this.tieneRetoque();
    this.pedido.c_adherible = this.llevaAdherible();
  }
  mandarNotificaciones(pedido: Pedido) {
    this.pedidosService.mandarNotificaciones(pedido);
  }
  //MODAL PARA VER LOS PRODUCTOS
  verDetalles(producto) {
    this.dialog.open(ModalDetallesProductoComponent, {
      data: { producto }
    });
  }
  abrirModal(num_fotos) {
    const dialogRef = this.dialog.open(Modal, {
      height: '55%',
      width: '55%',
      data: { num: num_fotos, familia: this.familiaSeleccionada }
    });
    dialogRef.afterClosed().subscribe(producto => {
      if (producto != null) {
        this.agregarProducto(producto);
      }
    })
  }
  abrirModalTicket(pedidoCreado) {
    const dialogRef = this.dialog.open(ModalGenerarTicketComponent, {
      data: { pedido: pedidoCreado }
    });
    dialogRef.afterClosed().subscribe(producto => {

    })
  }
  abrirModalTamano(ancho, alto) {
    const dialogRef = this.dialog.open(ModaDetallesTamComponent, {

      data: { ancho: ancho, alto: alto }
    });
    dialogRef.afterClosed().subscribe(producto => {
      if (producto != null) {
        this.agregarProducto(producto);
      }
    })
  }
  abrirModalPedido() {
    const dialogRef = this.dialog.open(ModalConfirmarCompraComponent, {
      data: {
        crear: false,
        pedido: this.pedido
      }
    });
    dialogRef.afterClosed().subscribe(crear => {
      if (crear) {
        this.crearPedido();

      } else {
        if (this.pedido.c_retoque && this.pedido.importante) {
          this.pedido.total = <number>this.pedido.total - 30;
        }
        this.clienteCtrl
        this.pedido = new Pedido();
      }
    })
    return true;
  }
  abrirCrearPedido() {
    this.generarFechaEntrega();
    this.obtenerCliente();
    this.asignarValoresDefault();
    if (this.pedidoValido()) {
      this.asignarFotografo();
    }
  }
  //SECCION PARA IMAGENES
  obtenerImagen(e) {
    /*this.cargando = true;
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      this.cargando = true;
      //console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
          this.cargando = false;
          this.imagen2 = result;
          this.imagen = new File([result], 'hola2', { type: 'image/jpeg' });
          console.log(result);
        }
      );
    });
    var localurl;
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      this.imagen = file;
      this.imageCompress.uploadFile().then(({ image, orientation }) => {
        this.imageCompress.compressFile(image, orientation, 50, 50).then(
          result => {
            this.imagen = result;
          }
        )
      })
    }*/
  }
  subirImagen(id) {
    const image = new FormData();
    image.append('image', this.imagen);
    this.empleadoService.crearFoto(image, id).subscribe(
      () => {

      },
      () => {

      }
    );
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
  productosEncontrados: Producto;
  error: Error;
  constructor(
    public dialogRef: MatDialogRef<Modal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private productoService: ProductosService) {
    this.productoBuscar = new Producto();
    this.productoBuscar.num_fotos = this.data.num;
    this.productoBuscar.familia = this.data.familia;
    this.buscador = false;
  }
  onNoClick(): void {
    this.productoBuscar = null;
    this.dialogRef.close();
  }
  buscar() {
    this.productosEncontrados = null;
    this.error = null;
    this.buscador = true;
    this.productoService.buscarProducto(this.productoBuscar).subscribe(
      (productos) => {
        this.productosEncontrados = productos;
        this.buscador = false;
      },
      (err: any) => {
        this.error = err.error;
        this.buscador = false;
      }
    )
  }
}
