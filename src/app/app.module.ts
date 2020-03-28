import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './comun/material.module';
import { NgxPrintModule } from 'ngx-print';

//modulos de componentes
import { AdministradorModule } from './administrador/modulo-administrador.module';
import { EmpleadoModule } from './empleado/modulo-empleado/modulo-empleado.module';
import { SupervisorModule } from './supervisor/modulo-supervisor/modulo-supervisor.module';
import { ComunModule } from './comun/comun.module';
import { RootModule } from './root/root.module';
import { ToastrModule } from 'ngx-toastr';

//componentes
import { LoginComponent } from './autenticacion/login/login.component';
import { TokenInterceptor } from './autenticacion/compartido/token.interceptor';
import { AutenticacionComponent } from './autenticacion/autenticacion.component';
import { NavComponent } from './comun/componentes/nav/nav.component';

//guardias
import { AutenticacionGuard } from './autenticacion/compartido/autenticacion.guard';

//sockets
import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { RecuperarContrasenaComponent } from './autenticacion/recuperar-contrasena/recuperar-contrasena.component';
const config: SocketIoConfig = {
  url: environment.wsUrl, options: {}
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    AutenticacionComponent,
    RecuperarContrasenaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdministradorModule,
    EmpleadoModule,
    SupervisorModule,
    RootModule,
    ComunModule,
    NgxPrintModule,
    ToastrModule.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    AutenticacionGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    RecuperarContrasenaComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
