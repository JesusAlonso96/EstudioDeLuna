"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = __importDefault(require("socket.io"));
const environment_1 = require("../global/environment");
const admin_1 = __importDefault(require("../rutas/admin"));
const cliente_1 = __importDefault(require("../rutas/cliente"));
const empleado_1 = __importDefault(require("../rutas/empleado"));
const estados_1 = __importDefault(require("../rutas/estados"));
const productos_1 = __importDefault(require("../rutas/productos"));
const usuario_1 = __importDefault(require("../rutas/usuario"));
const Socket = __importStar(require("../sockets/socket"));
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
            Socket.conectarCliente(cliente);
            Socket.desconectar(cliente);
            Socket.cerrarSesion(cliente);
            Socket.configurarUsuario(cliente, this.io);
        });
    }
    obtenerUsuariosConectados() {
        var usuarios = Socket.obtenerUsuariosConectados();
        console.log(usuarios);
    }
    inicializarRutas() {
        this.app.use('/api/v1/admins', admin_1.default);
        this.app.use('/api/v1/usuarios', usuario_1.default);
        this.app.use('/api/v1/clientes', cliente_1.default);
        this.app.use('/api/v1/estados', estados_1.default);
        this.app.use('/api/v1/productos', productos_1.default);
        this.app.use('/api/v1/empleados', empleado_1.default);
    }
    iniciar() {
        const appPath = path_1.default.join(__dirname, '../../../', 'dist/cliente');
        this.app.use(express_1.default.static(appPath));
        this.app.get('*', (req, res) => {
            res.sendFile(path_1.default.resolve(appPath, 'index.html'));
        });
        this.httpServidor.listen(this.puerto, () => {
            console.log('Servidor funcionando..');
        });
    }
}
exports.default = Servidor;
