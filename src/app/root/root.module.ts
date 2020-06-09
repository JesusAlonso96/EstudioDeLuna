import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComunModule } from '../comun/comun.module';
import { MaterialModule } from '../comun/material.module';
import { RootMainNavComponent } from './root-main-nav/root-main-nav.component';
import { RootProveedoresAltaComponent } from './root-proveedores-seccion/root-proveedores-alta/root-proveedores-alta.component';
import { RootProveedoresInsumoAltaComponent } from './root-proveedores-seccion/root-proveedores-insumos/root-proveedores-insumo-alta/root-proveedores-insumo-alta.component';
import { RootProveedoresInsumoBajaComponent } from './root-proveedores-seccion/root-proveedores-insumos/root-proveedores-insumo-baja/root-proveedores-insumo-baja.component';
import { RootProveedoresInsumoRestaurarComponent } from './root-proveedores-seccion/root-proveedores-insumos/root-proveedores-insumo-restaurar/root-proveedores-insumo-restaurar.component';
import { RootProveedoresSeccionComponent } from './root-proveedores-seccion/root-proveedores-seccion.component';
import { RootRoutingModule } from './root-routing.module';
import { AgregarSucursalesComponent } from './root-sucursales-seccion/agregar-sucursales/agregar-sucursales.component';
import { AsignarUsuariosSucursalesComponent } from './root-sucursales-seccion/asignar-usuarios-sucursales/asignar-usuarios-sucursales.component';
import { RootSucursalesSeccionComponent } from './root-sucursales-seccion/root-sucursales-seccion.component';
import { RootTableroSeccionComponent } from './root-tablero-seccion/root-tablero-seccion.component';
import { RootAdministrarUsuariosComponent } from './root-usuarios-seccion/root-administrar-usuarios/root-administrar-usuarios.component';
import { RootAltaUsuariosComponent } from './root-usuarios-seccion/root-alta-usuarios/root-alta-usuarios.component';
import { RootUsuariosSeccionComponent } from './root-usuarios-seccion/root-usuarios-seccion.component';
//componentes
import { RootComponent } from './root.component';
import { RootProveedoresBajaComponent } from './root-proveedores-seccion/root-proveedores-baja/root-proveedores-baja.component';
import { RootProveedoresEditarComponent } from './root-proveedores-seccion/root-proveedores-editar/root-proveedores-editar.component';
import { RootProveedoresRestaurarComponent } from './root-proveedores-seccion/root-proveedores-restaurar/root-proveedores-restaurar.component';
import { RootProveedoresInsumosComponent } from './root-proveedores-seccion/root-proveedores-insumos/root-proveedores-insumos.component';
import { RootConfiguracionSeccionComponent } from './root-configuracion-seccion/root-configuracion-seccion.component';
import { RootEmpresaSeccionComponent } from './root-empresa-seccion/root-empresa-seccion.component';
import { RootEmpresaSeccionDatosGeneralesComponent } from './root-empresa-seccion/root-empresa-seccion-datos-generales/root-empresa-seccion-datos-generales.component';
import { RootEmpresaSeccionContactoComponent } from './root-empresa-seccion/root-empresa-seccion-contacto/root-empresa-seccion-contacto.component';
import { RootEmpresaSeccionDireccionComponent } from './root-empresa-seccion/root-empresa-seccion-direccion/root-empresa-seccion-direccion.component';
import { RootEmpresaSeccionLogoComponent } from './root-empresa-seccion/root-empresa-seccion-logo/root-empresa-seccion-logo.component';
import { RootEmpresaSeccionFacturacionComponent } from './root-empresa-seccion/root-empresa-seccion-facturacion/root-empresa-seccion-facturacion.component';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [
    RootComponent,
    RootMainNavComponent,
    RootTableroSeccionComponent,
    RootSucursalesSeccionComponent,
    AgregarSucursalesComponent,
    AsignarUsuariosSucursalesComponent,
    RootUsuariosSeccionComponent,
    RootAltaUsuariosComponent,
    RootAdministrarUsuariosComponent,
    RootProveedoresSeccionComponent,
    RootProveedoresAltaComponent,
    RootProveedoresBajaComponent,
    RootProveedoresEditarComponent,
    RootProveedoresRestaurarComponent,
    RootProveedoresInsumosComponent,
    RootProveedoresInsumoAltaComponent,
    RootProveedoresInsumoBajaComponent,
    RootProveedoresInsumoRestaurarComponent,
    RootConfiguracionSeccionComponent,
    RootEmpresaSeccionComponent,
    RootEmpresaSeccionDatosGeneralesComponent,
    RootEmpresaSeccionContactoComponent,
    RootEmpresaSeccionDireccionComponent,
    RootEmpresaSeccionLogoComponent,
    RootEmpresaSeccionFacturacionComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RootRoutingModule,
    ComunModule,
    ImageCropperModule
  ]
})
export class RootModule { }
 