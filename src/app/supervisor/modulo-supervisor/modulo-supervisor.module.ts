import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/comun/material.module';

//componentes
import { MainNavSupervisorComponent } from '../main-nav-supervisor/main-nav-supervisor.component';
import { SupervisorPerfilComponent } from '../supervisor-perfil/supervisor-perfil.component';
import { SupervisorComponent } from '../supervisor.component';
import { SupervisorRoutingModule } from './supervisor-routing.module';
//servicios
import { SupervisorService } from '../servicio-supervisor/supervisor.service';
import { SupervisorGuard } from '../compartido/supervisor.guard';



@NgModule({
  declarations: [
    SupervisorComponent,
    MainNavSupervisorComponent,
    SupervisorPerfilComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    SupervisorRoutingModule
  ],
  providers: [
    SupervisorService,
    SupervisorGuard

  ]
})
export class SupervisorModule { }
