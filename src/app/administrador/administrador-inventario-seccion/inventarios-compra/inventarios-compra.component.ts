import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { SeleccionarInsumoCompraComponent } from 'src/app/comun/componentes/modales/seleccionar-insumo-compra/seleccionar-insumo-compra.component';
import { SeleccionarProveedorComponent } from 'src/app/comun/componentes/modales/seleccionar-proveedor/seleccionar-proveedor.component';
import { Almacen } from 'src/app/comun/modelos/almacen.model';
import { Compra, InsumoCompra } from 'src/app/comun/modelos/compra.model';
import { ProductoProveedor } from 'src/app/comun/modelos/producto_proveedor.model';
import { AlmacenService } from 'src/app/comun/servicios/almacen.service';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { SeleccionarOrdenDeCompraComponent } from 'src/app/comun/componentes/modales/seleccionar-orden-de-compra/seleccionar-orden-de-compra.component';
import { ProductoOrdenCompra, OrdenCompra } from 'src/app/comun/modelos/orden_compra.model';
import { ProveedoresService } from 'src/app/comun/servicios/proveedores.service';
import { NgToastrService } from 'src/app/comun/servicios/ng-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CargandoService } from 'src/app/comun/servicios/cargando.service';

@Component({
  selector: 'app-inventarios-compra',
  templateUrl: './inventarios-compra.component.html',
  styleUrls: ['./inventarios-compra.component.scss']
})
export class InventariosCompraComponent implements OnInit {
  cargando: boolean = false;
  iva: boolean = false;
  idBusqueda: number;
  nombreProductoSeleccionado: string;
  idOrdenCompra: string = '';
  compra: Compra = new Compra();
  insumoCompra: InsumoCompra = new InsumoCompra();
  productos: ProductoProveedor[] = [];
  almacenes: Almacen[] = [];
  dataSource: MatTableDataSource<InsumoCompra>;
  columnas: string[] = ['cantidad', 'existencia', 'nombre', 'descripcion', 'eliminar', 'costo'];
  ordenDeCompraSeleccionada: boolean = false;
  constructor(private dialog: MatDialog,
    private proveedoresService: ProveedoresService,
    private usuarioService: UsuarioService,
    private almacenesService: AlmacenService,
    private cargandoService: CargandoService,
    private toastr: NgToastrService) { }

  ngOnInit() {
    this.obtenerAlmacenes();
    this.iniciarVariablesEstaticas();
    this.inicializarTabla();
  }
  inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.compra.insumosCompra);
  }
  obtenerAlmacenes() {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo almacenes');
    this.almacenesService.obtenerAlmacenes().subscribe(
      (almacenes: Almacen[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.almacenes = almacenes;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );
  }
  seleccionaProveedor() {
    const dialogRef = this.dialog.open(SeleccionarProveedorComponent);
    dialogRef.afterClosed().subscribe(proveedor => {
      if (proveedor) {
        if (this.compra.proveedor.nombre != 'Sin proveedor seleccionado') {
          if (this.compra.proveedor._id != proveedor._id) {
            this.productos = [];
            this.compra.insumosCompra = [];
            this.dataSource.data = this.compra.insumosCompra;
          }
        }
        this.compra.proveedor = proveedor;
        this.obtenerProductosProveedor(this.compra.proveedor._id)
      }
    })
  }
  seleccionarOrdenDeCompra() {
    const dialogRef = this.dialog.open(SeleccionarOrdenDeCompraComponent);
    dialogRef.afterClosed().subscribe(ordenDeCompra => {
      if (ordenDeCompra) {
        this.idOrdenCompra = ordenDeCompra._id;
        if (ordenDeCompra.costoEnvio) {
          this.compra.costoEnvio = ordenDeCompra.costoEnvio;
        }
        if (ordenDeCompra.iva) {
          this.compra.iva = ordenDeCompra.iva;
          this.iva = true;
        }
        this.ordenDeCompraSeleccionada = true;
        this.compra.proveedor = ordenDeCompra.proveedor;
        this.obtenerProductosDeOrden(ordenDeCompra.productosOrdenCompra);
      }
    })
  }
  obtenerProductosDeOrden(productosOrden: ProductoOrdenCompra[]) {
    this.compra.insumosCompra = [];
    for (let producto of productosOrden) {
      this.productos.push(producto.insumo);
      this.compra.insumosCompra.push({
        insumo: producto.insumo,
        cantidad: producto.cantidadOrden,
        subtotal: producto.cantidadOrden * producto.insumo.costo
      })
    }
    this.dataSource.data = this.compra.insumosCompra;
  }
  obtenerProductosProveedor(idProveedor: string) {
    this.cargando = this.cargandoService.crearVistaCargando(true,'Obteniendo insumos del proveedor');
    this.proveedoresService.obtenerProductosProveedor(idProveedor).subscribe(
      (productos: ProductoProveedor[]) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.productos = productos;
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );
  }

  resetearFormulario() {
    this.compra = new Compra();
    this.compra.insumosCompra = [];
    this.compra.proveedor.nombre = 'Sin proveedor seleccionado';
    this.dataSource.data = this.compra.insumosCompra;
    this.ordenDeCompraSeleccionada = false;
  }
  generarCompra() {
    this.compra.subtotal = this.calcularSubtotalCompra();
    this.compra.total = this.calcularTotalCompra();
    this.cargando = this.cargandoService.crearVistaCargando(true);
    console.log(this.compra);
    this.usuarioService.generarCompra(this.compra).subscribe(
      (compraGuardada: any) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        if (this.idOrdenCompra !== '') {
          this.cargando = this.cargandoService.crearVistaCargando(true,'Generando compra');
          this.usuarioService.desactivarOrdenCompra(this.idOrdenCompra).subscribe(
            (desactivada: OrdenCompra) => {
              this.cargando = this.cargandoService.crearVistaCargando(false);
              this.toastr.abrirToastr('info','La orden de compra no puede volver a usarse', 'Se ha desactivado la orden de compra');
            },
            (err: HttpErrorResponse) => {
              this.cargando = this.cargandoService.crearVistaCargando(false);
              this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
            }
          );
        }

        this.toastr.abrirToastr('exito','Se ha registrado exitosamente la compra, los productos se han agregado al almacen', 'Compra registrada');
        this.resetearFormulario();
      },
      (err: HttpErrorResponse) => {
        this.cargando = this.cargandoService.crearVistaCargando(false);
        this.toastr.abrirToastr('error',err.error.detalles, err.error.titulo);
      }
    );

  }
  existenProductosEnCompra(): boolean {
    return this.compra.insumosCompra.length > 0 ? true : false;
  }
  proveedorSeleccionado(): boolean {
    return this.compra.proveedor.nombre == 'Sin proveedor seleccionado' ? false : true;
  }
  buscarProductosProveedor() {
    let productosCompra: InsumoCompra[] = [];
    for (let i = 0; i < this.productos.length; i++) {
      productosCompra.push({
        insumo: this.productos[i],
        cantidad: 0,
        subtotal: 0
      })
    }
    const dialogRef = this.dialog.open(SeleccionarInsumoCompraComponent, { data: productosCompra });
    dialogRef.afterClosed().subscribe(productos => {
      if (productos) {
        this.importarProductosSeleccionados(productos);
      }
    })
  }
  filtroProducto() {
    if (this.productos.find(producto => { return producto.id == this.idBusqueda })) {
      this.insumoCompra.insumo = this.productos.find(producto => { return producto.id == this.idBusqueda });
      this.nombreProductoSeleccionado = this.insumoCompra.insumo.nombre;
    } else {
      this.insumoCompra.insumo = new ProductoProveedor();
      this.nombreProductoSeleccionado = 'Sin producto seleccionado';
    }
  }
  agregarProducto() {
    if (this.nombreProductoSeleccionado != 'Sin producto seleccionado' && this.insumoCompra.cantidad != undefined) {
      const respuesta = this.existeEnCompra(this.insumoCompra);
      if (respuesta) {
        this.compra.insumosCompra[respuesta[1]].cantidad += this.insumoCompra.cantidad;
        this.insumoCompra = new InsumoCompra();
        this.nombreProductoSeleccionado = 'Sin producto seleccionado';
        this.idBusqueda = undefined;
      } else {
        this.compra.insumosCompra.push(this.insumoCompra);
        this.dataSource.data = this.compra.insumosCompra;
        this.insumoCompra = new InsumoCompra();
        this.nombreProductoSeleccionado = 'Sin producto seleccionado';
        this.idBusqueda = undefined;
      }
    }
  }
  existeEnCompra(producto: InsumoCompra): [InsumoCompra, number] {
    for (let i = 0; i < this.compra.insumosCompra.length; i++) {
      if (this.compra.insumosCompra[i].insumo.id == producto.insumo.id) {
        return [producto, i];
      }
    }
    return undefined
  }
  importarProductosSeleccionados(productos: InsumoCompra[]) {
    this.compra.insumosCompra = productos;
    //calcular subtotales de cada producto
    this.dataSource.data = this.compra.insumosCompra;
  }
  importarTodosLosProductos() {
    this.compra.insumosCompra = [];
    if (this.productos.length == 0) {
      this.toastr.abrirToastr('info','Sin productos','Este proveedor no cuenta con productos' );
    } else {
      for (let i = 0; i < this.productos.length; i++) {
        this.compra.insumosCompra.push({
          insumo: this.productos[i],
          cantidad: 1,
          subtotal: (this.productos[i].costo * 1)
        })
      }
      this.dataSource.data = this.compra.insumosCompra;
    }
  }
  iniciarVariablesEstaticas() {
    this.compra.proveedor.nombre = 'Sin proveedor seleccionado';
    this.nombreProductoSeleccionado = 'Sin proveedor seleccionado';
  }
  calcularSubtotalCompra(): number {
    let total: number = 0;
    if (this.compra.insumosCompra.length > 0) {
      for (let prod of this.compra.insumosCompra) {
        total = total + (prod.insumo.costo * prod.cantidad);
      }
    }
    return total;
  }
  calcularTotalCompra(): number {
    let subtotal: number = 0;
    if (this.compra.insumosCompra.length > 0) {
      for (let prod of this.compra.insumosCompra) {
        subtotal = subtotal + (prod.insumo.costo * prod.cantidad);
      }
      if (this.iva) {
        this.compra.iva = (subtotal * .16);
        subtotal = subtotal + this.compra.iva;
      }
      else this.compra.iva = 0;
      if (this.compra.costoEnvio) subtotal = subtotal + this.compra.costoEnvio;
      return subtotal;
    } else return 0;

  }
  eliminarProducto(producto: InsumoCompra) {
    const indice = this.compra.insumosCompra.indexOf(producto);
    this.compra.insumosCompra.splice(indice, 1);
    this.dataSource.data = this.compra.insumosCompra;
  }
}
