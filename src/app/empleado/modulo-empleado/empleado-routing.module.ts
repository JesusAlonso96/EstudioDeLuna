import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componentes de modulo
import { EmpleadoComponent } from '../empleado.component';
import { EmpleadoPerfilComponent } from '../empleado-perfil/empleado-perfil.component';
import { RegistroUsuarioComponent } from '../registro-usuario/registro-usuario.component';
import { EmpleadoVentaComponent } from '../empleado-venta/empleado-venta.component';
import { EmpleadoPedidosRealizadosComponent } from '../empleado-pedidos-realizados/empleado-pedidos-realizados.component';

//guardia
import { AutenticacionGuard } from 'src/app/autenticacion/compartido/autenticacion.guard';
import { EmpleadoPedidosProcesoComponent } from '../empleado-pedidos-proceso/empleado-pedidos-proceso.component';
import { EmpleadoPedidosColaComponent } from '../empleado-pedidos-cola/empleado-pedidos-cola.component';
import { EmpleadoPedidosComponent } from '../empleado-pedidos/empleado-pedidos.component';
import { EmpleadoDashboardFotografoComponent } from '../empleado-dashboard-fotografo/empleado-dashboard-fotografo.component';



const routes: Routes = [
    {
        path: 'usuario',
        component: EmpleadoComponent,
        canActivate: [AutenticacionGuard],
        children: [
            { path: 'perfil', component: EmpleadoPerfilComponent },
            { path: 'dashboard', component: EmpleadoDashboardFotografoComponent},
            { path: 'registrar', component: RegistroUsuarioComponent },
            { path: 'nuevaVenta', component: EmpleadoVentaComponent },
            { path: 'pedidos-realizados', component: EmpleadoPedidosRealizadosComponent },
            { path: 'pedidos-proceso', component:EmpleadoPedidosProcesoComponent},
            { path: 'pedidos-cola', component: EmpleadoPedidosColaComponent},
            { path: 'pedidos', component: EmpleadoPedidosComponent}
        ]
    }
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class EmpleadoRoutingModule { }