import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
//modulos
import { ComunModule } from 'src/app/comun/comun.module';
import { MaterialModule } from 'src/app/comun/material.module';
import { EstadosService } from 'src/app/comun/servicios/estados.service';
import { ProductosService } from 'src/app/comun/servicios/productos.service';
import { UsuarioService } from 'src/app/comun/servicios/usuario.service';
import { EmpleadoGuard } from '../compartido/empleado.guard';
//pipes
import { ProductosFiltroPipe } from '../compartido/productos-filtro.pipe';
import { EmpleadoDashboardFotografoComponent } from '../empleado-dashboard-fotografo/empleado-dashboard-fotografo.component';
import { PedidosProximosComponent } from '../empleado-dashboard-fotografo/pedidos-proximos/pedidos-proximos.component';
import { EmpleadoNotificacionesComponent } from '../empleado-notificaciones/empleado-notificaciones.component';
import { ConfirmarModalComponent } from '../empleado-pedidos-cola/confirmar-modal/confirmar-modal.component';
import { EmpleadoPedidosColaComponent } from '../empleado-pedidos-cola/empleado-pedidos-cola.component';
import { EmpleadoPedidosProcesoComponent } from '../empleado-pedidos-proceso/empleado-pedidos-proceso.component';
import { EmpleadoPedidosRealizadosComponent } from '../empleado-pedidos-realizados/empleado-pedidos-realizados.component';
import { EmpleadoPedidosComponent } from '../empleado-pedidos/empleado-pedidos.component';
import { PedidoEstadoComponent } from '../empleado-pedidos/pedido-estado/pedido-estado.component';
import { EmpleadoPerfilComponent } from '../empleado-perfil/empleado-perfil.component';
import { EmpleadoVentaComponent, Modal } from '../empleado-venta/empleado-venta.component';
import { ModalConfirmarCompraComponent } from '../empleado-venta/modal-confirmar-compra/modal-confirmar-compra.component';
//modales
import { ModalDetallesProductoComponent } from '../empleado-venta/modal-detalles-producto/modal-detalles-producto.component';
import { ModaDetallesTamComponent } from '../empleado-venta/modal-detalles-tam/modal-detalles-tam.component';
import { ModalGenerarTicketComponent } from '../empleado-venta/modal-generar-ticket/modal-generar-ticket.component';
//componentes
import { EmpleadoComponent } from '../empleado.component';
import { MainNavEmpleadoComponent } from '../main-nav-empleado/main-nav-empleado.component';
import { RegistroUsuarioComponent } from '../registro-usuario/registro-usuario.component';
import { EmpleadoVentaListaProductosComponent } from '../empleado-venta/empleado-venta-lista-productos/empleado-venta-lista-productos.component';
import { EmpleadoVentaTablaProductosAgregadosComponent } from '../empleado-venta/empleado-venta-tabla-productos-agregados/empleado-venta-tabla-productos-agregados.component';

//servicios
import { EmpleadoService } from '../servicio-empleado/empleado.service';
import { EmpleadoRoutingModule } from './empleado-routing.module';
import { ImageCropperModule } from 'ngx-image-cropper';








@NgModule({
  declarations: [
    EmpleadoComponent,
    MainNavEmpleadoComponent,
    EmpleadoPerfilComponent,
    RegistroUsuarioComponent,
    EmpleadoVentaComponent,
    ProductosFiltroPipe,
    Modal,
    ModalDetallesProductoComponent,
    EmpleadoPedidosRealizadosComponent,
    EmpleadoPedidosProcesoComponent,
    EmpleadoNotificacionesComponent,
    ModaDetallesTamComponent,
    ModalConfirmarCompraComponent,
    ModalGenerarTicketComponent,
    EmpleadoPedidosColaComponent,
    ConfirmarModalComponent,
    EmpleadoPedidosComponent,
    PedidoEstadoComponent,
    EmpleadoDashboardFotografoComponent,
    PedidosProximosComponent,
    EmpleadoVentaListaProductosComponent,
    EmpleadoVentaTablaProductosAgregadosComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    EmpleadoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComunModule,
    NgxPrintModule,
    ImageCropperModule
  ],
  exports: [
    PedidosProximosComponent

  ],
  providers: [
    EmpleadoService,
    EmpleadoGuard,
    EstadosService,
    ProductosService,
    UsuarioService,
  ],
  entryComponents: [
    Modal,
    ModalDetallesProductoComponent,
    ModaDetallesTamComponent,
    ModalConfirmarCompraComponent,
    ModalGenerarTicketComponent,
    ConfirmarModalComponent,
    PedidoEstadoComponent
  ]
})
export class EmpleadoModule { }
