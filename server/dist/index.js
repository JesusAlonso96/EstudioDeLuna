"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const servidor_1 = __importDefault(require("./clases/servidor"));
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
/* Rutas de imagenes */
servidor.app.use(express_1.default.static('subidas'));
/* Rutas */
servidor.inicializarRutas(); /*
const pest = new Pestana({
    rol: 'Administrador',
    nombre: 'Sucursales',
    ruta: '/admin/sucursales',
    icono: 'icono'
})
pest.save();*/
/*Servidor inicializado */
servidor.iniciar();
