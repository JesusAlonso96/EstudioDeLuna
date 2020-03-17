import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './autenticacion/login/login.component';
//guardias
import { AutenticacionGuard } from './autenticacion/compartido/autenticacion.guard';
import { AdministradorComponent } from './administrador/administrador.component';
import { adminRoutes } from './administrador/administrador-routing.module';
import { EmpleadoComponent } from './empleado/empleado.component';
import { empleadoRoutes } from './empleado/modulo-empleado/empleado-routing.module';
import { RootComponent } from './root/root.component';
import { rootRoutes } from './root/root-routing.module';


const routes: Routes = [
  {path:'', component: LoginComponent},
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdministradorComponent, children: adminRoutes, canActivate: [AutenticacionGuard] },
  { path: 'usuario', component: EmpleadoComponent, children: empleadoRoutes, canActivate: [AutenticacionGuard] },
  { path: 'root', component: RootComponent, children: rootRoutes ,canActivate: [AutenticacionGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
