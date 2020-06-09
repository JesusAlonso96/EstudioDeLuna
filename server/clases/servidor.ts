import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import SocketIO from 'socket.io';
import { environment } from '../global/environment';
import rutasAdmin from '../rutas/admin';
import rutasCliente from '../rutas/cliente';
import rutasEmpleado from '../rutas/empleado';
import rutasEstados from '../rutas/estados';
import rutasProductos from '../rutas/productos';
import rutasUsuario from '../rutas/usuario';
import * as Socket from '../sockets/socket';
import rutasAlmacen from '../rutas/almacen';
import { Usuario } from '../modelos/usuario.model';
import { Estado } from '../modelos/estado.model';
import { Municipio } from '../modelos/municipio.model';
import rutasRoot from '../rutas/root';
import rutasCaja from '../rutas/caja';
import rutasConfiguracion from '../rutas/configuracion';
import rutasProveedores from '../rutas/proveedores';
import rutasInventario from '../rutas/inventario';
import rutasSucursal from '../rutas/sucursal';
import rutasTraspaso from '../rutas/traspaso';
import rutasCotizaciones from '../rutas/cotizaciones';
import rutasTipoGastoGeneral from '../rutas/tipo_gasto_general';
import rutasGastoGeneral from '../rutas/gasto_general';
import rutasGastoInsumo from '../rutas/gasto_insumo';
import rutasCompras from '../rutas/compras';
import rutasPedidos from '../rutas/pedidos';
import rutasEmpresa from '../rutas/empresa';

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
        this.io.origins('*:*');
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
        this.app.use('/api/v1/almacenes', rutasAlmacen);
        this.app.use('/api/v1/inventarios', rutasInventario);
        this.app.use('/api/v1/traspasos', rutasTraspaso);
        this.app.use('/api/v1/sucursales', rutasSucursal);
        this.app.use('/api/v1/tipos-gasto-general', rutasTipoGastoGeneral);
        this.app.use('/api/v1/gastos-generales', rutasGastoGeneral);
        this.app.use('/api/v1/gastos-insumos', rutasGastoInsumo);
        this.app.use('/api/v1/compras', rutasCompras);
        this.app.use('/api/v2/root', rutasRoot);
        this.app.use('/api/v2/cajas', rutasCaja);
        this.app.use('/api/v2/configuracion', rutasConfiguracion);
        this.app.use('/api/v2/proveedores', rutasProveedores);
        this.app.use('/api/v2/cotizaciones', rutasCotizaciones);
        this.app.use('/api/v2/pedidos', rutasPedidos);
        this.app.use('/api/v2/empresa', rutasEmpresa);
    }
    iniciar() {
        this.inicializarRutas();
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