import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes de modulo
import { SupervisorComponent } from '../supervisor.component';
import { SupervisorPerfilComponent } from '../supervisor-perfil/supervisor-perfil.component';
import { SupervisorGuard } from '../compartido/supervisor.guard';
import { AutenticacionGuard } from 'src/app/autenticacion/compartido/autenticacion.guard';



const routes: Routes = [
    {
        path: 'supervisor',
        component: SupervisorComponent,
        canActivate: [AutenticacionGuard],
        children: [
            { path: 'perfil', component: SupervisorPerfilComponent }
        ]
    }
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class SupervisorRoutingModule { }