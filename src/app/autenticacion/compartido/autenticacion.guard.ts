import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ServicioAutenticacionService } from '../servicio-autenticacion/servicio-autenticacion.service';

@Injectable()
export class AutenticacionGuard implements CanActivate {

    private url: string;
    constructor(private authService: ServicioAutenticacionService, private router: Router) { }

    private manejarAutenticacion(): boolean {
        if (this.loginOHomeOCuentaInvalida()) {
            return false;
        }
        return true;
    }
    private getTipoUsuario() {
        return this.authService.getTipoUsuario();
    }
    private getTipoTrabajador() {
        return this.authService.getTipoTrabajador();
    }

    private loginOHomeOCuentaInvalida(): boolean {
        const usuario = this.getTipoUsuario();
        console.log("entre al guardiaa", usuario)
        switch (usuario) {
            case 0:
                if (this.url.includes('login') || this.url.includes('admin') || this.url.includes('supervisor') || this.url.includes('root')) {
                    this.router.navigate(['/usuario/dashboard']);
                    return true;
                }
                return false;
            case 1:
                if (this.url.includes('login') || this.url.includes('admin') || this.url.includes('usuario') || this.url.includes('root')) {
                    this.router.navigate(['/supervisor/dashboard']);
                    return true;
                }
                return false;
            case 2:
                if (this.url.includes('login') || this.url.includes('supervisor') || this.url.includes('usuario') || this.url.includes('root')) {
                    this.router.navigate(['/admin/dashboard']);
                    return true;
                }
                return false;
            case 3:
                if (this.url.includes('login') || this.url.includes('supervisor') || this.url.includes('usuario') || this.url.includes('admin')) {
                    this.router.navigate(['/root']);
                    return true;
                }
                return false;
        }
    }
    private urlInvalida(): boolean {
        if (this.url.includes('usuario') || this.url.includes('admin') || this.url.includes('supervisor')) return true;

        return false;
    }
    private noManejarAutenticacion(): boolean {
        if (this.urlInvalida() || !this.authService.estaAutenticado()) {
            this.router.navigate(['/login']);
            return true;
        }
        return false;
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.url = state.url;
        console.log(this.url);
        if (this.authService.estaAutenticado()) {
            return this.manejarAutenticacion();
        }
        localStorage.removeItem('usuario_meta');
        localStorage.removeItem('usuario_auth')
        localStorage.removeItem('usuario-ws')
        return this.noManejarAutenticacion()
    }
}