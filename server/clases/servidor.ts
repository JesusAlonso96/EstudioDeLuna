import express, {Request, Response} from 'express';
import { environment } from '../global/environment';
import SocketIO from 'socket.io';
import http from 'http';
import rutasAdmin from '../rutas/admin';
import rutasUsuario from '../rutas/usuario';
import rutasCliente from '../rutas/cliente';
import rutasEstados from '../rutas/estados';
import rutasProductos from '../rutas/productos';
import rutasEmpleado from '../rutas/empleado';
import * as Socket from '../sockets/socket';
import { Usuario } from '../modelos/usuario.model';
import path from 'path';

export default class Servidor {
    private static _instance: Servidor;
    public app: express.Application;
    public puerto: number;
    public io: SocketIO.Server;
    private httpServidor: http.Server;
    private constructor() {
        this.app = express();
        this.puerto = environment.PUERTO_SERVIDOR;
        this.httpServidor = new http.Server(this.app);
        this.io = SocketIO(this.httpServidor);
        this.escucharSockets();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private escucharSockets() {
        console.log('Escuchando sockets');
        this.io.on('connection', cliente => {
            console.log('Cliente conectado');
            Socket.conectarCliente(cliente);
            Socket.desconectar(cliente);
            Socket.cerrarSesion(cliente);
            Socket.configurarUsuario(cliente, this.io);
        });
    }

    public obtenerUsuariosConectados() {
        var usuarios: any = Socket.obtenerUsuariosConectados();
        console.log(usuarios);
    }
    inicializarRutas() {
        this.app.use('/api/v1/admins', rutasAdmin);
        this.app.use('/api/v1/usuarios', rutasUsuario);
        this.app.use('/api/v1/clientes', rutasCliente);
        this.app.use('/api/v1/estados', rutasEstados);
        this.app.use('/api/v1/productos', rutasProductos);
        this.app.use('/api/v1/empleados', rutasEmpleado);
    }
    iniciar() {
        /*
        new Usuario({
            nombre: 'admin',
            ape_pat: 'admin',
            ape_mat:'admin',
            username:'admin',
            email:'admin@admin',
            telefono:1234567893,
            contrasena:'hola',
            rol:2,
            rol_sec:0,

        }).save()*/
        const appPath = path.join(__dirname, '../../../', 'dist/cliente');
        this.app.use(express.static(appPath));

        this.app.get('*', (req: Request, res: Response) => {
            res.sendFile(path.resolve(appPath, 'index.html'));
        });
        this.httpServidor.listen(this.puerto, () => {
            console.log('Servidor funcionando..')
        });
    }
}