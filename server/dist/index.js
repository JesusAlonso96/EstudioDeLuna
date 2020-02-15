"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const servidor_1 = __importDefault(require("./clases/servidor"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const admin_1 = __importDefault(require("./rutas/admin"));
const usuario_1 = __importDefault(require("./rutas/usuario"));
const cliente_1 = __importDefault(require("./rutas/cliente"));
const estados_1 = __importDefault(require("./rutas/estados"));
const productos_1 = __importDefault(require("./rutas/productos"));
const empleado_1 = __importDefault(require("./rutas/empleado"));
const environment_1 = require("./global/environment");
const servidor = servidor_1.default.instance;
/* Conexion a la BD */
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.set('useUnifiedTopology', true);
mongoose_1.default.connect(environment_1.environment.DB_URL, { useNewUrlParser: true });
/* Body parser */
servidor.app.use(body_parser_1.default.urlencoded({ extended: true }));
servidor.app.use(body_parser_1.default.json());
/* CORS */
servidor.app.use(cors_1.default({ origin: true, credentials: true }));
/* Rutas */
//servidor.inicializarRutas();
servidor.app.use('/api/v1/admins', admin_1.default);
servidor.app.use('/api/v1/usuarios', usuario_1.default);
servidor.app.use('/api/v1/clientes', cliente_1.default);
servidor.app.use('/api/v1/estados', estados_1.default);
servidor.app.use('/api/v1/productos', productos_1.default);
servidor.app.use('/api/v1/empleados', empleado_1.default);
/*Servidor inicializado */
servidor.iniciar();
