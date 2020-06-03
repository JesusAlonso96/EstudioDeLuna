import { Component, OnInit } from '@angular/core';
import { ProductoProveedor } from 'src/app/comun/modelos/producto_proveedor.model';
import { Proveedor } from 'src/app/comun/modelos/proveedor.model';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SeleccionarProveedorComponent } from 'src/app/comun/componentes/modales/seleccionar-proveedor/seleccionar-proveedor.component';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { OrdenCompra, ProductoOrdenCompra } from 'src/app/comun/modelos/orden_compra.model';
import { SeleccionarProductoProveedorComponent } from 'src/app/comun/componentes/modales/seleccionar-producto-proveedor/seleccionar-producto-proveedor.component';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-generar-orden-compra',
  templateUrl: './generar-orden-compra.component.html',
  styleUrls: ['./generar-orden-compra.component.scss']
})
export class GenerarOrdenCompraComponent implements OnInit {
  idBusqueda: number;
  fechaEntrega: any;
  fechaPedido: any;
  nombreProductoSeleccionado: string;
  ordenCompra: OrdenCompra = new OrdenCompra();
  productoOrdenCompra: ProductoOrdenCompra = new ProductoOrdenCompra();
  dataSource: MatTableDataSource<ProductoOrdenCompra>;
  proveedor: Proveedor = new Proveedor();
  productos: ProductoProveedor[];
  productoSeleccionado: ProductoProveedor = new ProductoProveedor();
  cargando: boolean = false;
  columnas: string[] = ['cantidad', 'existencia', 'nombre', 'descripcion', 'eliminar', 'costo'];
  iva: boolean;
  //FORMULARIO
  constructor(private dialog: MatDialog,
    private toastr: NgToastrService,
    private usuarioService: UsuarioService,
    private proveedoresService: ProveedoresService) { }

  ngOnInit() {
    this.iniciarVariablesEstaticas();
    this.inicializarTabla();
  }
  inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.ordenCompra.productosOrdenCompra);
  }
  seleccionaProveedor() {
    const dialogRef = this.dialog.open(SeleccionarProveedorComponent);
    dialogRef.afterClosed().subscribe(proveedor => {
      if (proveedor) {
        if (this.ordenCompra.proveedor.nombre != 'Sin proveedor seleccionado') {
          if (this.ordenCompra.proveedor._id != proveedor._id) {
            this.productos = [];
            this.ordenCompra.productosOrdenCompra = [];
            this.dataSource.data = this.ordenCompra.productosOrdenCompra;
          }
        }
        this.ordenCompra.proveedor = proveedor;
        this.obtenerProductosProveedor(this.ordenCompra.proveedor._id);
      }
    })
  }
  obtenerProductosProveedor(idProveedor: string) {
    this.cargando = true;
    this.proveedoresService.obtenerProductosProveedor(idProveedor).subscribe(
      (productos: ProductoProveedor[]) => {
        this.cargando = false;
        this.productos = productos;
      },
      (err: HttpErrorResponse) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  iniciarVariablesEstaticas() {
    this.ordenCompra.proveedor.nombre = 'Sin proveedor seleccionado';
    this.nombreProductoSeleccionado = 'Sin producto seleccionado';
  }
  proveedorSeleccionado(): boolean {
    return this.ordenCompra.proveedor.nombre == 'Sin proveedor seleccionado' ? false : true;
  }
  filtroProducto() {
    if (this.productos.find(producto => { return producto.id == this.idBusqueda })) {
      this.productoOrdenCompra.insumo = this.productos.find(producto => { return producto.id == this.idBusqueda });
      this.nombreProductoSeleccionado = this.productoOrdenCompra.insumo.nombre;
    } else {
      this.productoOrdenCompra.insumo = new ProductoProveedor();
      this.nombreProductoSeleccionado = 'Sin producto seleccionado';
    }
  }
  agregarProducto() {
    if (this.nombreProductoSeleccionado != 'Sin producto seleccionado' && this.productoOrdenCompra.cantidadOrden != undefined) {
      const respuesta = this.existeEnOrdenCompra(this.productoOrdenCompra);
      if (respuesta) {
        this.ordenCompra.productosOrdenCompra[respuesta[1]].cantidadOrden += this.productoOrdenCompra.cantidadOrden;
        this.productoOrdenCompra = new ProductoOrdenCompra();
        this.nombreProductoSeleccionado = 'Sin producto seleccionado';
        this.idBusqueda = undefined;
      } else {
        this.ordenCompra.productosOrdenCompra.push(this.productoOrdenCompra);
        this.dataSource.data = this.ordenCompra.productosOrdenCompra;
        this.productoOrdenCompra = new ProductoOrdenCompra();
        this.nombreProductoSeleccionado = 'Sin producto seleccionado';
        this.idBusqueda = undefined;
      }
    } else {
      this.toastr.abrirToastr('advertencia', '', 'Selecciona un producto del proveedor');
    }
  }
  generarOrdenCompra() {
    let error: boolean = false;
    console.log(this.ordenCompra.proveedor)
    if (this.ordenCompra.proveedor.nombre == 'Sin proveedor seleccionado') {
      this.toastr.abrirToastr('error', 'Por favor, ingresa el proveedor', 'Proveedor requerido');
      error = true;
    }
    if (!this.fechaPedido) {
      this.toastr.abrirToastr('error', 'Por favor, ingresa la fecha del pedido', 'Fecha del pedido requerida');
      error = true;
    }
    if (!this.fechaEntrega) {
      this.toastr.abrirToastr('error', 'Por favor, ingresa la fecha de entrega', 'Fecha de entrega requerida');
      error = true;
    }
    if (this.ordenCompra.productosOrdenCompra.length == 0 || !this.ordenCompra.productosOrdenCompra) {
      this.toastr.abrirToastr('error', 'Por favor, ingresa productos a la orden', 'Productos requeridos');
      error = true;
    }
    if (!error) {
      this.ordenCompra.fechaEntrega = this.fechaEntrega._d;
      this.ordenCompra.fechaPedido = this.fechaPedido._d;
      this.ordenCompra.subtotal = this.calcularSubtotalOrden();
      this.ordenCompra.total = this.calcularTotalOrden();
      this.guardarOrdenCompra(this.ordenCompra);
    }
  }
  resetearFormulario() {
    this.ordenCompra = new OrdenCompra();
    this.ordenCompra.productosOrdenCompra = [];
    this.fechaPedido = null;
    this.fechaEntrega = null;
    this.ordenCompra.proveedor.nombre = 'Sin proveedor seleccionado';
    this.dataSource.data = this.ordenCompra.productosOrdenCompra;
  }
  guardarOrdenCompra(ordenCompra: OrdenCompra) {
    this.cargando = true;
    this.usuarioService.agregarOrdenCompra(ordenCompra).subscribe(
      (ordenGuardada: OrdenCompra) => {
        this.cargando = false;
        this.toastr.abrirToastr('exito', 'Se ha creado exitosamente la orden de compra', 'Orden de compra creada');
        this.resetearFormulario();
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.abrirToastr('error', err.error.detalles, err.error.titulo);
      }
    );
  }
  buscarProductosProveedor() {
    let productosOrdenCompra: ProductoOrdenCompra[] = [];
    for (let i = 0; i < this.productos.length; i++) {
      productosOrdenCompra.push({
        insumo: this.productos[i],
        cantidadOrden: 0
      })
    }
    const dialogRef = this.dialog.open(SeleccionarProductoProveedorComponent, { data: productosOrdenCompra });
    dialogRef.afterClosed().subscribe(productos => {
      if (productos) {
        this.importarProductosSeleccionados(productos);
      }
    })
  }
  importarProductosSeleccionados(productos: ProductoOrdenCompra[]) {
    this.ordenCompra.productosOrdenCompra = productos;
    this.dataSource.data = this.ordenCompra.productosOrdenCompra;
  }
  importarTodosLosProductos() {
    this.ordenCompra.productosOrdenCompra = [];
    if (this.productos.length == 0) {
      this.toastr.abrirToastr('info', 'Este proveedor no cuenta con productos', 'Sin productos');
    } else {
      for (let i = 0; i < this.productos.length; i++) {
        this.ordenCompra.productosOrdenCompra.push({
          insumo: this.productos[i],
          cantidadOrden: 1
        })
      }
      this.dataSource.data = this.ordenCompra.productosOrdenCompra;
    }
  }
  eliminarProducto(producto: ProductoOrdenCompra) {
    const indice = this.ordenCompra.productosOrdenCompra.indexOf(producto);
    this.ordenCompra.productosOrdenCompra.splice(indice, 1);
    this.dataSource.data = this.ordenCompra.productosOrdenCompra;
  }
  existeEnOrdenCompra(producto: ProductoOrdenCompra): [ProductoOrdenCompra, number] {
    for (let i = 0; i < this.ordenCompra.productosOrdenCompra.length; i++) {
      if (this.ordenCompra.productosOrdenCompra[i].insumo.id == producto.insumo.id) {
        return [producto, i];
      }
    }
    return undefined;
  }
  calcularSubtotalOrden(): number {
    let total: number = 0;
    if (this.ordenCompra.productosOrdenCompra.length > 0) {
      for (let prod of this.ordenCompra.productosOrdenCompra) {
        total = total + (prod.insumo.costo * prod.cantidadOrden);
      }
    }
    return total;
  }
  calcularTotalOrden(): number {
    let subtotal: number = 0;
    if (this.ordenCompra.productosOrdenCompra.length > 0) {
      for (let prod of this.ordenCompra.productosOrdenCompra) {
        subtotal = subtotal + (prod.insumo.costo * prod.cantidadOrden);
      }
      if (this.iva) {
        this.ordenCompra.iva = (subtotal * .16);
        subtotal = subtotal + this.ordenCompra.iva;
      }
      else this.ordenCompra.iva = 0;
      if (this.ordenCompra.costoEnvio) subtotal = subtotal + this.ordenCompra.costoEnvio;
      return subtotal;
    } else return 0;

  }
}
