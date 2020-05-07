import { Router } from 'express';
import * as DatosCtrl from '../controladores/datos_estudio';
import { autenticacionMiddleware } from '../middlewares/middlewares';
import multer from 'multer';
import crypto from 'crypto';
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, crypto.createHash('sha256').update(file.originalname).digest('base64') + '.jpeg')
    },
    destination: function (req, file, cb) {
        cb(null, './subidas/logo');
    }
}), upload = multer({ storage });
const rutasDatos = Router();

//get
rutasDatos.get('', autenticacionMiddleware, DatosCtrl.obtenerDatos);








export default rutasDatos;