import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './autenticacion/login/login.component';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
