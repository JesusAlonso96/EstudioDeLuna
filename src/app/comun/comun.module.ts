import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//componentes
import { AltaClienteComponent } from './componentes/alta-cliente/alta-cliente.component';
import { CatalogoFamiliasComponent } from './componentes/catalogo-familias/catalogo-familias.component';
import { CatalogoProductosComponent } from './componentes/catalogo-productos/catalogo-productos.component';
import { InfoSucursalesComponent } from './componentes/info-sucursales/info-sucursales.component';
import { EncabezadoTituloComponent } from './componentes/encabezado-titulo/encabezado-titulo.component';
import { AgregarProductoComponent } from './componentes/catalogo-productos/agregar-producto/agregar-producto.component';
import { EliminarProductoComponent } from './componentes/catalogo-productos/eliminar-producto/eliminar-producto.component';
import { EditarProductoComponent } from './componentes/catalogo-productos/editar-producto/editar-producto.component';
import { AgregarFamiliaComponent } from './componentes/catalogo-familias/agregar-familia/agregar-familia.component';
import { EliminarFamiliaComponent } from './componentes/catalogo-familias/eliminar-familia/eliminar-familia.component';
import { BajaClienteComponent } from './componentes/baja-cliente/baja-cliente.component';
import { RestaurarClienteComponent } from './componentes/restaurar-cliente/restaurar-cliente.component';
import { ConsultaClienteComponent } from './componentes/consulta-cliente/consulta-cliente.component';
import { DatosClienteComponent } from './componentes/consulta-cliente/datos-cliente/datos-cliente.component';
import { EditarClienteComponent } from './componentes/consulta-cliente/editar-cliente/editar-cliente.component';
import { PedidosClienteComponent } from './componentes/consulta-cliente/datos-cliente/pedidos-cliente/pedidos-cliente.component';
import { CargandoComponent } from './componentes/cargando/cargando.component';
import { ModalConfirmacionComponent } from './componentes/modal-confirmacion/modal-confirmacion.component';
import { ConsultaUsuarioComponent } from './componentes/consulta-usuario/consulta-usuario.component';
import { AltaUsuarioComponent } from './componentes/alta-usuario/alta-usuario.component';
import { EditarUsuarioComponent } from './componentes/consulta-usuario/editar-usuario/editar-usuario.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { SeleccionarEmpleadoComponent } from './componentes/modales/seleccionar-empleado/seleccionar-empleado.component';
import { DetallesProductoComponent } from './componentes/modales/detalles-producto/detalles-producto.component';
import { ListaPedidosComponent } from './componentes/lista-pedidos/lista-pedidos.component';
import { MostrarVentasFotografosComponent } from './componentes/modales/mostrar-ventas-fotografos/mostrar-ventas-fotografos.component';
import { DesgloseVentasFotografosComponent } from './componentes/modales/desglose-ventas-fotografos/desglose-ventas-fotografos.component';
import { EditarProveedorComponent } from './componentes/modales/editar-proveedor/editar-proveedor.component';
import { SeleccionarProveedorComponent } from './componentes/modales/seleccionar-proveedor/seleccionar-proveedor.component';
import { BarraCargandoComponent } from './componentes/barra-cargando/barra-cargando.component';
import { EditarProductoProveedorComponent } from './componentes/modales/editar-producto-proveedor/editar-producto-proveedor.component';
import { AltaEmpresaComponent } from './componentes/modales/alta-empresa/alta-empresa.component';
import { EditarEmpresaComponent } from './componentes/modales/editar-empresa/editar-empresa.component';
import { VerCotizacionComponent } from './componentes/modales/ver-cotizacion/ver-cotizacion.component';
import { BuscadorComponent } from './componentes/buscador/buscador.component';
//modulos
import { MaterialModule } from './material.module';
//servicios
import { EstadosService } from './servicios/estados.service';
import { ClienteService } from './servicios/cliente.service';
import { UsuarioService } from './servicios/usuario.service';
import { BuscadorService } from './servicios/buscador.service';
import { DatosService } from './servicios/datos.service';
//pipes
import { FiltroPedidosPipe } from './pipes/filtro-pedidos.pipe';
import { FormatoFechaPipe } from './pipes/formato-fecha.pipe';
import { PaginacionPipe } from './pipes/paginacion.pipe';
import { FiltroProductosPipe } from './pipes/filtro-productos.pipe';
import { FiltroCotizacionPipe } from './pipes/filtro-cotizacion.pipe';

@NgModule({
    declarations: [
        AltaClienteComponent,
        InfoSucursalesComponent,
        CatalogoFamiliasComponent,
        CatalogoProductosComponent,
        FiltroPedidosPipe,
        FormatoFechaPipe,
        PaginacionPipe,
        FiltroProductosPipe,
        FiltroCotizacionPipe,
        EncabezadoTituloComponent,
        AgregarProductoComponent,
        EliminarProductoComponent,
        EditarProductoComponent,
        AgregarFamiliaComponent,
        EliminarFamiliaComponent,
        BajaClienteComponent,
        RestaurarClienteComponent,
        ConsultaClienteComponent,
        DatosClienteComponent,
        EditarClienteComponent,
        PedidosClienteComponent,
        CargandoComponent,
        ModalConfirmacionComponent,
        ConsultaUsuarioComponent,
        AltaUsuarioComponent,
        EditarUsuarioComponent,
        PerfilComponent,
        SeleccionarEmpleadoComponent,
        DetallesProductoComponent,
        ListaPedidosComponent,
        MostrarVentasFotografosComponent,
        DesgloseVentasFotografosComponent,
        EditarProveedorComponent,
        SeleccionarProveedorComponent,
        BarraCargandoComponent,
        EditarProductoProveedorComponent,
        AltaEmpresaComponent,
        EditarEmpresaComponent,
        VerCotizacionComponent,
        BuscadorComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,

    ],
    exports: [
        AltaClienteComponent,
        FiltroPedidosPipe,
        FormatoFechaPipe,
        PaginacionPipe,
        FiltroProductosPipe,
        FiltroCotizacionPipe,
        InfoSucursalesComponent,
        CatalogoFamiliasComponent,
        CatalogoProductosComponent,
        EncabezadoTituloComponent,
        BajaClienteComponent,
        RestaurarClienteComponent,
        ConsultaClienteComponent,
        CargandoComponent,
        ConsultaUsuarioComponent,
        AltaUsuarioComponent,
        PerfilComponent,
        ListaPedidosComponent,
        BarraCargandoComponent,
        BuscadorComponent

    ],
    entryComponents: [
        AgregarProductoComponent,
        EliminarProductoComponent,
        EditarProductoComponent,
        AgregarFamiliaComponent,
        EliminarFamiliaComponent,
        DatosClienteComponent,
        EditarClienteComponent,
        PedidosClienteComponent,
        ModalConfirmacionComponent,
        EditarUsuarioComponent,
        SeleccionarEmpleadoComponent,
        DetallesProductoComponent,
        MostrarVentasFotografosComponent,
        DesgloseVentasFotografosComponent,
        EditarProveedorComponent,
        SeleccionarProveedorComponent,
        EditarProductoProveedorComponent,
        AltaEmpresaComponent,
        EditarEmpresaComponent,
        VerCotizacionComponent,
    ],
    providers: [
        EstadosService,
        ClienteService,
        UsuarioService,
        BuscadorService,
        DatosService
    ],
})
export class ComunModule { }
