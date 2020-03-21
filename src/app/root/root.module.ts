import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../comun/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RootRoutingModule } from './root-routing.module';
//componentes
import { RootComponent } from './root.component';
import { RootMainNavComponent } from './root-main-nav/root-main-nav.component';
import { RootTableroSeccionComponent } from './root-tablero-seccion/root-tablero-seccion.component';
import { RootSucursalesSeccionComponent } from './root-sucursales-seccion/root-sucursales-seccion.component';
import { AgregarSucursalesComponent } from './root-sucursales-seccion/agregar-sucursales/agregar-sucursales.component';
import { AsignarUsuariosSucursalesComponent } from './root-sucursales-seccion/asignar-usuarios-sucursales/asignar-usuarios-sucursales.component';
import { ComunModule } from '../comun/comun.module';
import { RootUsuariosSeccionComponent } from './root-usuarios-seccion/root-usuarios-seccion.component';
import { RootAltaUsuariosComponent } from './root-usuarios-seccion/root-alta-usuarios/root-alta-usuarios.component';
import { RootAdministrarUsuariosComponent } from './root-usuarios-seccion/root-administrar-usuarios/root-administrar-usuarios.component';



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
    RootAdministrarUsuariosComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RootRoutingModule,
    ComunModule
  ]
})
export class RootModule { }
 