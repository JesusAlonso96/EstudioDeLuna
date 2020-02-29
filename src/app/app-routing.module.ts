import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './autenticacion/login/login.component';
import { RecuperarContrasenaComponent } from './autenticacion/recuperar-contrasena/recuperar-contrasena.component';
//guardias
import { AutenticacionGuard } from './autenticacion/compartido/autenticacion.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  //{
    //path: '**',
    //redirectTo: '',
  //},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AutenticacionGuard]
  },
  {
    path:'recuperar',
    component: RecuperarContrasenaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
