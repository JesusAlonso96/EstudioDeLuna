"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_1 = require("../global/environment");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const admin_1 = __importDefault(require("../rutas/admin"));
const usuario_1 = __importDefault(require("../rutas/usuario"));
const cliente_1 = __importDefault(require("../rutas/cliente"));
const estados_1 = __importDefault(require("../rutas/estados"));
const productos_1 = __importDefault(require("../rutas/productos"));
const empleado_1 = __importDefault(require("../rutas/empleado"));
class Servidor {
    constructor() {
        this.app = express_1.default();
        this.puerto = environment_1.environment.PUERTO_SERVIDOR;
        this.httpServidor = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServidor);
        this.escucharSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    escucharSockets() {
        console.log('Escuchando sockets');
        this.io.on('connection', cliente => {
            console.log('Cliente conectado');
            cliente.on('disconnect', () => {
                console.log('Cliente desconectado');
            });
        });
    }
    iniciar() {
        this.httpServidor.listen(this.puerto, () => {
            console.log('Servidor funcionando..');
        });
    }
    inicializarRutas() {
        this.app.use('/api/v1/admins', admin_1.default);
        this.app.use('/api/v1/usuarios', usuario_1.default);
        this.app.use('/api/v1/clientes', cliente_1.default);
        this.app.use('/api/v1/estados', estados_1.default);
        this.app.use('/api/v1/productos', productos_1.default);
        this.app.use('/api/v1/empleados', empleado_1.default);
    }
}
exports.default = Servidor;
