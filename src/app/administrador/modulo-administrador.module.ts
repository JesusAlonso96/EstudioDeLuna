import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/comun/material.module';
import { ChartsModule } from 'ng2-charts';
import { NgxPrintModule } from 'ngx-print';

//componentes
import { AdministradorComponent } from './administrador.component';
import { AdministradorPerfilComponent } from './administrador-perfil/administrador-perfil.component';
import { MainNavAdminComponent } from './main-nav-admin/main-nav-admin.component';
import { AdministradorVentasSeccionComponent } from './administrador-ventas-seccion/administrador-ventas-seccion.component';
//seccion de tablero principal
import { AdministradorTableroSeccionComponent } from './administrador-tablero-seccion/administrador-tablero-seccion.component';
import { PedidosColaComponent } from './administrador-tablero-seccion/pedidos-cola/pedidos-cola.component';
import { PedidosVendidosComponent } from './administrador-tablero-seccion/pedidos-vendidos/pedidos-vendidos.component';
import { PedidosCompletadosComponent } from './administrador-tablero-seccion/pedidos-completados/pedidos-completados.component';
//seccion de inventario
import { AdministradorInventarioSeccionComponent } from './administrador-inventario-seccion/administrador-inventario-seccion.component';
import { InventariosOrdenCompraComponent } from './administrador-inventario-seccion/inventarios-orden-compra/inventarios-orden-compra.component';
import { InventariosCompraComponent } from './administrador-inventario-seccion/inventarios-compra/inventarios-compra.component';
import { InventariosInvFisicoComponent } from './administrador-inventario-seccion/inventarios-inv-fisico/inventarios-inv-fisico.component';
import { InventariosAlmacenesComponent } from './administrador-inventario-seccion/inventarios-almacenes/inventarios-almacenes.component';
import { InventariosAlmacenesRestaurarComponent } from './administrador-inventario-seccion/inventarios-almacenes/inventarios-almacenes-restaurar/inventarios-almacenes-restaurar.component';
import { InventariosAlmacenesTraspasosComponent } from './administrador-inventario-seccion/inventarios-almacenes-traspasos/inventarios-almacenes-traspasos.component';
import { InventariosEntradasSalidasComponent } from './administrador-inventario-seccion/inventarios-entradas-salidas/inventarios-entradas-salidas.component';
import { GenerarOrdenCompraComponent } from './administrador-inventario-seccion/inventarios-orden-compra/generar-orden-compra/generar-orden-compra.component';
import { HistorialOrdenesCompraComponent } from './administrador-inventario-seccion/inventarios-orden-compra/historial-ordenes-compra/historial-ordenes-compra.component';
import { InventariosAlmacenesDetallesComponent } from './administrador-inventario-seccion/inventarios-almacenes/inventarios-almacenes-detalles/inventarios-almacenes-detalles.component';
//seccion de productos
import { ProductosSeccionComponent } from './productos-seccion/productos-seccion.component';
//seccion de familias de productos
import { FamiliasProductosSeccionComponent } from './familias-productos-seccion/familias-productos-seccion.component';
//seccion de usuarios
import { AdministradorUsuariosSeccionComponent } from './administrador-usuarios-seccion/administrador-usuarios-seccion.component';
import { UsuariosAltaComponent } from './administrador-usuarios-seccion/usuarios-alta/usuarios-alta.component';
import { UsuariosBajaComponent } from './administrador-usuarios-seccion/usuarios-baja/usuarios-baja.component';
import { UsuariosConsultaComponent } from './administrador-usuarios-seccion/usuarios-consulta/usuarios-consulta.component';
import { UsuariosRestaurarComponent } from './administrador-usuarios-seccion/usuarios-restaurar/usuarios-restaurar.component';
import { CambiarPermisosComponent } from './administrador-usuarios-seccion/usuarios-consulta/cambiar-permisos/cambiar-permisos.component';
//seccion de clientes
import { AdministradorClientesSeccionComponent } from './administrador-clientes-seccion/administrador-clientes-seccion.component';
//seccion de ABD DE CLIENTES
import { ClientesAltaComponent } from './administrador-clientes-seccion/clientes-alta/clientes-alta.component';
import { ClientesBajaComponent } from './administrador-clientes-seccion/clientes-baja/clientes-baja.component';
import { ClientesConsultaComponent } from './administrador-clientes-seccion/clientes-consulta/clientes-consulta.component';
import { ClientesRestaurarComponent } from './administrador-clientes-seccion/clientes-restaurar/clientes-restaurar.component';
//seccion de compras
import { AdministradorComprasSeccionComponent } from './administrador-compras-seccion/administrador-compras-seccion.component';
//seccion de proveedores
import { AdministradorProveedoresSeccionComponent } from './administrador-proveedores-seccion/administrador-proveedores-seccion.component';
import { ProveedoresAltaComponent } from './administrador-proveedores-seccion/proveedores-alta/proveedores-alta.component';
import { ProveedoresBajaComponent } from './administrador-proveedores-seccion/proveedores-baja/proveedores-baja.component';
import { ProveedoresEditarComponent } from './administrador-proveedores-seccion/proveedores-editar/proveedores-editar.component';
import { ProveedoresAgregarProductoComponent } from './administrador-proveedores-seccion/proveedores-agregar-producto/proveedores-agregar-producto.component';
import { ProveedoresEditarProductoComponent } from './administrador-proveedores-seccion/proveedores-editar-producto/proveedores-editar-producto.component';
import { ProveedoresRestaurarComponent } from './administrador-proveedores-seccion/proveedores-restaurar/proveedores-restaurar.component';
import { ProveedoresRestaurarProductoComponent } from './administrador-proveedores-seccion/proveedores-restaurar-producto/proveedores-restaurar-producto.component';
//seccion de cotizaciones
import { AdministradorCotizacionesSeccionComponent } from './administrador-cotizaciones-seccion/administrador-cotizaciones-seccion.component';
import { GenerarCotizacionComponent } from './administrador-cotizaciones-seccion/generar-cotizacion/generar-cotizacion.component';
import { EmpresasComponent } from './administrador-cotizaciones-seccion/empresas/empresas.component';
import { RestaurarEmpresaComponent } from './administrador-cotizaciones-seccion/restaurar-empresa/restaurar-empresa.component';
import { HistorialCotizacionesComponent } from './administrador-cotizaciones-seccion/historial-cotizaciones/historial-cotizaciones.component';
//seccion de facturacion
import { AdministradorFacturacionSeccionComponent } from './administrador-facturacion-seccion/administrador-facturacion-seccion.component';
//seccion de ventas
import { CorteCajaComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/corte-caja/corte-caja.component';
import { AdministradorReporteVentasComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/administrador-reporte-ventas.component';
import { EditarCantidadComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/corte-caja/editar-cantidad/editar-cantidad.component';
import { HistorialCortesCajaComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/historial-cortes-caja/historial-cortes-caja.component';
//seccion de reportes de ventas
import { ReporteVentasDiaComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/reporte-ventas-dia/reporte-ventas-dia.component'
import { ReporteVentasFechaComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/reporte-ventas-fecha/reporte-ventas-fecha.component';
import { ReporteVentasFamiliaComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/reporte-ventas-fecha/reporte-ventas-familia/reporte-ventas-familia.component';
import { ReporteVentasMesComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/reporte-ventas-mes/reporte-ventas-mes.component';
import { ListadoVentasMesComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/reporte-ventas-mes/listado-ventas-mes/listado-ventas-mes.component';
//seccion de ayuda
import { AdministradorAyudaSeccionComponent } from './administrador-ayuda-seccion/administrador-ayuda-seccion.component';
//servicios
import { AdministradorService } from './servicio-administrador/servicio-administrador.service';
//modulos
import { ComunModule } from 'src/app/comun/comun.module';
import { AdministradorRoutingModule } from './administrador-routing.module';
//guardia
import { AutenticacionGuard } from 'src/app/autenticacion/compartido/autenticacion.guard';
import { FamiliasProductoRestaurarComponent } from './familias-productos-seccion/familias-producto-restaurar/familias-producto-restaurar.component';
import { AdministradorConfiguracionSistemaComponent } from './administrador-configuracion-sistema/administrador-configuracion-sistema.component';
import { AdministradorCajaSeccionComponent } from './administrador-caja-seccion/administrador-caja-seccion.component';
import { CajaDetallesComponent } from './administrador-caja-seccion/caja-detalles/caja-detalles.component';
import { CajaRestaurarComponent } from './administrador-caja-seccion/caja-restaurar/caja-restaurar.component';
import { TemasService } from '../comun/servicios/temas.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { InventariosInvFisicoAlmacenesComponent } from './administrador-inventario-seccion/inventarios-inv-fisico/inventarios-inv-fisico-almacenes/inventarios-inv-fisico-almacenes.component';
import { InventariosInvFisicoHistorialComponent } from './administrador-inventario-seccion/inventarios-inv-fisico/inventarios-inv-fisico-historial/inventarios-inv-fisico-historial.component';
import { InventariosInvFisicoAlmacenesAltaModalComponent } from './administrador-inventario-seccion/inventarios-inv-fisico/inventarios-inv-fisico-almacenes/inventarios-inv-fisico-almacenes-alta-modal/inventarios-inv-fisico-almacenes-alta-modal.component';
import { InventariosInvFisicoAlmacenesExistenciasModalComponent } from './administrador-inventario-seccion/inventarios-inv-fisico/inventarios-inv-fisico-almacenes/inventarios-inv-fisico-almacenes-existencias-modal/inventarios-inv-fisico-almacenes-existencias-modal.component';
import { InventariosInvFisicoHistorialExistenciasModalComponent } from './administrador-inventario-seccion/inventarios-inv-fisico/inventarios-inv-fisico-historial/inventarios-inv-fisico-historial-existencias-modal/inventarios-inv-fisico-historial-existencias-modal.component';
import { InventariosBajaInsumoComponent } from './administrador-inventario-seccion/inventarios-baja-insumo/inventarios-baja-insumo.component';
import { InventariosAlmacenesTraspasosPendientesComponent } from './administrador-inventario-seccion/inventarios-almacenes-traspasos/inventarios-almacenes-traspasos-pendientes/inventarios-almacenes-traspasos-pendientes.component';
import { InventariosAlmacenesTraspasosAltaComponent } from './administrador-inventario-seccion/inventarios-almacenes-traspasos/inventarios-almacenes-traspasos-alta/inventarios-almacenes-traspasos-alta.component';
import { InventariosEntradasSalidasDetallesModalComponent } from './administrador-inventario-seccion/inventarios-entradas-salidas/inventarios-entradas-salidas-detalles-modal/inventarios-entradas-salidas-detalles-modal.component';


@NgModule({
  declarations: [
    AdministradorComponent,
    AdministradorPerfilComponent,
    MainNavAdminComponent,
    AdministradorVentasSeccionComponent,
    AdministradorReporteVentasComponent,
    ReporteVentasFechaComponent,
    ReporteVentasDiaComponent,
    ReporteVentasFamiliaComponent,
    ReporteVentasMesComponent,
    ListadoVentasMesComponent,
    CorteCajaComponent,
    EditarCantidadComponent,
    HistorialCortesCajaComponent,
    FamiliasProductosSeccionComponent,
    ProductosSeccionComponent,
    AdministradorClientesSeccionComponent,
    AdministradorComprasSeccionComponent,
    AdministradorUsuariosSeccionComponent,
    AdministradorInventarioSeccionComponent,
    AdministradorProveedoresSeccionComponent,
    ClientesAltaComponent,
    ClientesBajaComponent,
    ClientesConsultaComponent,
    ClientesRestaurarComponent,
    UsuariosAltaComponent,
    UsuariosBajaComponent,
    UsuariosConsultaComponent,
    UsuariosRestaurarComponent,
    CambiarPermisosComponent,
    AdministradorTableroSeccionComponent,
    PedidosColaComponent,
    PedidosVendidosComponent,
    PedidosCompletadosComponent,
    ProveedoresAltaComponent,
    ProveedoresBajaComponent,
    ProveedoresEditarComponent,
    ProveedoresAgregarProductoComponent,
    ProveedoresEditarProductoComponent,
    ProveedoresRestaurarComponent,
    ProveedoresRestaurarProductoComponent,
    AdministradorAyudaSeccionComponent,
    AdministradorCotizacionesSeccionComponent,
    GenerarCotizacionComponent,
    EmpresasComponent,
    RestaurarEmpresaComponent,
    HistorialCotizacionesComponent,
    AdministradorFacturacionSeccionComponent,
    FamiliasProductoRestaurarComponent,
    AdministradorConfiguracionSistemaComponent,
    InventariosOrdenCompraComponent,
    InventariosCompraComponent,
    InventariosInvFisicoComponent,
    InventariosAlmacenesComponent,
    InventariosAlmacenesTraspasosComponent,
    InventariosEntradasSalidasComponent,
    InventariosAlmacenesRestaurarComponent,
    GenerarOrdenCompraComponent,
    HistorialOrdenesCompraComponent,
    InventariosAlmacenesDetallesComponent,
    AdministradorCajaSeccionComponent,
    CajaDetallesComponent,
    CajaRestaurarComponent,
    InventariosInvFisicoAlmacenesComponent,
    InventariosInvFisicoHistorialComponent,
    InventariosInvFisicoAlmacenesAltaModalComponent,
    InventariosInvFisicoAlmacenesExistenciasModalComponent,
    InventariosInvFisicoHistorialExistenciasModalComponent,
    InventariosBajaInsumoComponent,
    InventariosAlmacenesTraspasosPendientesComponent,
    InventariosAlmacenesTraspasosAltaComponent,
    InventariosEntradasSalidasDetallesModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    AdministradorRoutingModule,
    ComunModule,
    ChartsModule,
    NgxPrintModule,
    ReactiveFormsModule,
    FormsModule,
    ImageCropperModule
  ],
  entryComponents: [
    ListadoVentasMesComponent,
    EditarCantidadComponent,
    CambiarPermisosComponent
  ],
  providers: [
    AdministradorService,
    TemasService,
    AutenticacionGuard
  ]
})
export class AdministradorModule { }
