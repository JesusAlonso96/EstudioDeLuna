import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import mongoose, { NativeError } from 'mongoose';
import Servidor from './clases/servidor';
import { environment } from './global/environment';
import {Usuario, IUsuario} from './modelos/usuario.model';

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

/* Rutas de imagenes */
servidor.app.use(express.static('subidas'));

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
