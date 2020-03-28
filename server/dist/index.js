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
/*
for (let i=0;i< 397; i++){
    new Usuario({
        nombre: `usuario ${i+244556677889900112233}`,
        username: `usuario ${i+244556677889900112233}`,
        ape_pat: `usuario ${i+244556677889900112233}`,
        email:`email${i+244556677889900112233}@mail`,
        telefono:7899652354,
        contrasena:'hola',
        rol:2,
        rol_sec:-1,
        sucursal:'5e765035221f4b2580983f1c'
   
    }).save((err: NativeError, usuario: IUsuario)=>{
        if(err) console.log(err);
        if(usuario) console.log(`inserte ${i+1}`)
    })
}*/
/*Servidor inicializado */
servidor.iniciar();
