import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes de modulo
import { AdministradorPerfilComponent } from '../administrador-perfil/administrador-perfil.component';
import { AdministradorComponent } from '../administrador.component';
import { AutenticacionGuard } from 'src/app/autenticacion/compartido/autenticacion.guard';
import { AdministradorVentasSeccionComponent } from '../administrador-ventas-seccion/administrador-ventas-seccion.component';
import { AdministradorReporteVentasComponent } from '../administrador-ventas-seccion/administrador-reporte-ventas/administrador-reporte-ventas.component';
import { FamiliasProductosSeccionComponent } from '../familias-productos-seccion/familias-productos-seccion.component';
import { ProductosSeccionComponent } from '../productos-seccion/productos-seccion.component';
import { AdministradorComprasSeccionComponent } from '../administrador-compras-seccion/administrador-compras-seccion.component';
import { AdministradorClientesSeccionComponent } from '../administrador-clientes-seccion/administrador-clientes-seccion.component';
import { AdministradorUsuariosSeccionComponent } from '../administrador-usuarios-seccion/administrador-usuarios-seccion.component';
import { AdministradorInventarioSeccionComponent } from '../administrador-inventario-seccion/administrador-inventario-seccion.component';
import { AdministradorProveedoresSeccionComponent } from '../administrador-proveedores-seccion/administrador-proveedores-seccion.component';
import { AdministradorSucursalesSeccionComponent } from '../administrador-sucursales-seccion/administrador-sucursales-seccion.component';
import { AdministradorTableroSeccionComponent } from '../administrador-tablero-seccion/administrador-tablero-seccion.component';
import { AdministradorAyudaSeccionComponent } from '../administrador-ayuda-seccion/administrador-ayuda-seccion.component';




const routes: Routes = [
    {
        path: 'admin',
        redirectTo: 'admin/perfil',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        component: AdministradorComponent,
        canActivate: [AutenticacionGuard],
        children: [
            { path: 'dashboard', component: AdministradorTableroSeccionComponent },
            { path: 'perfil', component: AdministradorPerfilComponent },
            {
                path: 'ventas',
                component: AdministradorVentasSeccionComponent,
                children: [
                    { path: 'reportes-ventas', component: AdministradorReporteVentasComponent },
                ]
            },
            {
                path: 'compras',
                component: AdministradorComprasSeccionComponent
            },
            {
                path: 'clientes',
                component: AdministradorClientesSeccionComponent
            },
            {
                path: 'familias-productos',
                component: FamiliasProductosSeccionComponent
            },
            {
                path: 'productos',
                component: ProductosSeccionComponent
            },
            {
                path: 'usrs',
                component: AdministradorUsuariosSeccionComponent
            },
            {
                path: 'inventarios',
                component: AdministradorInventarioSeccionComponent
            },
            {
                path: 'proveedores',
                component: AdministradorProveedoresSeccionComponent
            },
            {
                path: 'sucursales',
                component: AdministradorSucursalesSeccionComponent
            },
            {
                path: 'ayuda',
                component: AdministradorAyudaSeccionComponent
            }
        ]

    }
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AdministradorRoutingModule { }