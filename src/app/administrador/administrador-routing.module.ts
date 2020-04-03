import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes de modulo
import { AdministradorPerfilComponent } from './administrador-perfil/administrador-perfil.component';
import { AdministradorComponent } from './administrador.component';
import { AutenticacionGuard } from 'src/app/autenticacion/compartido/autenticacion.guard';
import { AdministradorVentasSeccionComponent } from './administrador-ventas-seccion/administrador-ventas-seccion.component';
import { AdministradorReporteVentasComponent } from './administrador-ventas-seccion/administrador-reporte-ventas/administrador-reporte-ventas.component';
import { FamiliasProductosSeccionComponent } from './familias-productos-seccion/familias-productos-seccion.component';
import { ProductosSeccionComponent } from './productos-seccion/productos-seccion.component';
import { AdministradorComprasSeccionComponent } from './administrador-compras-seccion/administrador-compras-seccion.component';
import { AdministradorClientesSeccionComponent } from './administrador-clientes-seccion/administrador-clientes-seccion.component';
import { AdministradorUsuariosSeccionComponent } from './administrador-usuarios-seccion/administrador-usuarios-seccion.component';
import { AdministradorInventarioSeccionComponent } from './administrador-inventario-seccion/administrador-inventario-seccion.component';
import { AdministradorProveedoresSeccionComponent } from './administrador-proveedores-seccion/administrador-proveedores-seccion.component';
import { AdministradorTableroSeccionComponent } from './administrador-tablero-seccion/administrador-tablero-seccion.component';
import { AdministradorAyudaSeccionComponent } from './administrador-ayuda-seccion/administrador-ayuda-seccion.component';
import { AdministradorCotizacionesSeccionComponent } from './administrador-cotizaciones-seccion/administrador-cotizaciones-seccion.component';
import { AdministradorFacturacionSeccionComponent } from './administrador-facturacion-seccion/administrador-facturacion-seccion.component';
import { AdministradorConfiguracionSistemaComponent } from './administrador-configuracion-sistema/administrador-configuracion-sistema.component';
import { AdministradorCajaSeccionComponent } from './administrador-caja-seccion/administrador-caja-seccion.component';




export const adminRoutes: Routes = [
    { path: 'dashboard', component: AdministradorTableroSeccionComponent, canActivate: [AutenticacionGuard] },
    { path: 'perfil', component: AdministradorPerfilComponent, canActivate: [AutenticacionGuard] },
    {
        path: 'ventas',
        component: AdministradorVentasSeccionComponent,
        canActivate: [AutenticacionGuard],
        children: [
            { path: 'reportes-ventas', component: AdministradorReporteVentasComponent, canActivate: [AutenticacionGuard] },
        ]
    },
    {
        path: 'compras',
        component: AdministradorComprasSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'clientes',
        component: AdministradorClientesSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'familias-productos',
        component: FamiliasProductosSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'productos',
        component: ProductosSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'usrs',
        component: AdministradorUsuariosSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'inventarios',
        component: AdministradorInventarioSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'proveedores',
        component: AdministradorProveedoresSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'cotizaciones',
        component: AdministradorCotizacionesSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'facturacion',
        component: AdministradorFacturacionSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'ayuda',
        component: AdministradorAyudaSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'cajas',
        component: AdministradorCajaSeccionComponent,
        canActivate: [AutenticacionGuard]
    },
    {
        path: 'configuracion',
        component: AdministradorConfiguracionSistemaComponent,
        canActivate: [AutenticacionGuard]
    }
]
@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdministradorRoutingModule { }