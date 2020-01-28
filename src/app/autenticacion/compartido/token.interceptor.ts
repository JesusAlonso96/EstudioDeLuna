import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { ServicioAutenticacionService } from '../servicio-autenticacion/servicio-autenticacion.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    
    constructor(public authService: ServicioAutenticacionService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                },
            });
        }
        return next.handle(request);
    }
}