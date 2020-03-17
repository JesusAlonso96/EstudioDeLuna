import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootTableroSeccionComponent } from './root-tablero-seccion/root-tablero-seccion.component';
import { RootSucursalesSeccionComponent } from './root-sucursales-seccion/root-sucursales-seccion.component';


export const rootRoutes: Routes = [
    { path: 'dashboard', component: RootTableroSeccionComponent },
    { path:'sucursales', component: RootSucursalesSeccionComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(rootRoutes)],
    exports: [RouterModule]
})
export class RootRoutingModule { }