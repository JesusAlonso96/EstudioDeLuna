import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UsuarioWS } from '../modelos/usuariows.model';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    public estatusSocket = false;
    public usuario: UsuarioWS = null;

    constructor(private socket: Socket) {
        this.cargarAlmacenamientoLocal();
        this.verificarEstatus();
    }

    verificarEstatus() {
        this.socket.on('connect', () => {
            console.log('Conectado al servidor');
            this.estatusSocket = true;
        })
        this.socket.on('disconnect', () => {
            console.log('Desconectado del servidor');
            this.estatusSocket = false;
        })
    }
    emitir(evento: string, payload?: any, callback?: Function) {
        this.socket.emit(evento, payload, callback);
    }
    escuchar(evento: string) {
        return this.socket.fromEvent(evento);
    }
    iniciarSesionWS(usuario: UsuarioWS) {
        return new Promise((resolve, reject) => {
            this.emitir('configurar-usuario', usuario, resp => {
                this.usuario = usuario;
                this.guardarAlmacenamientoLocal();
                resolve();
            });
        });
    }
    cerrarSesionWS() {
        return new Promise((resolve, reject) => {
            this.emitir('cerrar-sesion', this.usuario, resp => {
                console.log("entre aquiiiii");
                localStorage.removeItem('usuario-ws');
                resolve();
            });
        });
    }
    guardarAlmacenamientoLocal() {
        localStorage.setItem('usuario-ws', JSON.stringify(this.usuario));
    }
    cargarAlmacenamientoLocal() {
        if (localStorage.getItem('usuario-ws')) {
            this.usuario = JSON.parse(localStorage.getItem('usuario-ws'));
            this.iniciarSesionWS(this.usuario);
        }
    }
    obtenerUsuario() {
        return this.usuario;
    }
}

