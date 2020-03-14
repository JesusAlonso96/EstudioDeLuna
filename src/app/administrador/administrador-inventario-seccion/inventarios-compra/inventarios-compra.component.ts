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
import { ProductoOrdenCompra } from 'src/app/comun/modelos/orden_compra.model';

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
  compra: Compra = new Compra();
  insumoCompra: InsumoCompra = new InsumoCompra();
  productos: ProductoProveedor[] = [];
  almacenes: Almacen[] = [];
  dataSource: MatTableDataSource<InsumoCompra>;
  columnas: string[] = ['cantidad', 'existencia', 'nombre', 'descripcion', 'eliminar', 'costo'];
  constructor(private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private almacenesService: AlmacenService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerAlmacenes();
    this.iniciarVariablesEstaticas();
    this.inicializarTabla();
  }
  inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.compra.insumosCompra);
  }
  obtenerAlmacenes() {
    this.cargando = true;
    this.almacenesService.obtenerAlmacenes().subscribe(
      (almacenes: Almacen[]) => {
        this.cargando = false;
        this.almacenes = almacenes;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true });
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
        console.log(ordenDeCompra); //pc-respaldo\usuario
        this.compra.proveedor = ordenDeCompra.proveedor;
        this.obtenerProductosDeOrden(ordenDeCompra.productosOrdenCompra);
      }
    })
  }
  obtenerProductosDeOrden(productosOrden: ProductoOrdenCompra[]) {
    for (let producto of productosOrden) {
      this.productos.push(producto.insumo);
    }
  }
  obtenerProductosProveedor(idProveedor: string) {
    this.cargando = true;
    this.usuarioService.obtenerProductosProveedor(idProveedor).subscribe(
      (productos: ProductoProveedor[]) => {
        this.cargando = false;
        this.productos = productos;
      },
      (err: any) => {
        this.cargando = false;
        this.toastr.error(err.error.detalles, err.error.titulo, { closeButton: true })
      }
    );
  }

  resetearFormulario() {

  }
  generarCompra() {
    console.log(this.compra.almacen)
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
      this.toastr.info('Este proveedor no cuenta con productos', 'Sin productos', { closeButton: true });
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
