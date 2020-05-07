import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Servidor from './clases/servidor';
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

/* Rutas de imagenes */
servidor.app.use(express.static('subidas'));
servidor.app.use(express.static('subidas/logotipos'));


/*Servidor inicializado */
servidor.iniciar();
