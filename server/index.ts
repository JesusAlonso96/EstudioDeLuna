import Servidor from './clases/servidor';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import rutasAdmin from './rutas/admin';
import rutasUsuario from './rutas/usuario';
import rutasCliente from './rutas/cliente';
import rutasEstados from './rutas/estados';
import rutasProductos from './rutas/productos';
import rutasEmpleado from './rutas/empleado';
import { environment } from './global/environment';

const servidor = Servidor.instance;
/* Conexion a la BD */
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(environment.DB_URL, { useNewUrlParser: true });
/* Body parser */
servidor.app.use(bodyParser.urlencoded({ extended: true }));
servidor.app.use(bodyParser.json());

/* CORS */
servidor.app.use(cors({ origin: true, credentials: true }));

/* Rutas */
//servidor.inicializarRutas();
servidor.app.use('/api/v1/admins', rutasAdmin);
servidor.app.use('/api/v1/usuarios', rutasUsuario);
servidor.app.use('/api/v1/clientes', rutasCliente);
servidor.app.use('/api/v1/estados', rutasEstados);
servidor.app.use('/api/v1/productos', rutasProductos);
servidor.app.use('/api/v1/empleados', rutasEmpleado);
/*Servidor inicializado */
servidor.iniciar();
