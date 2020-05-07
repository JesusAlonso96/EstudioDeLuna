import { Router } from 'express';
import multer from 'multer';
import * as ConfiguracionCtrl from '../controladores/configuracion';
import { autenticacionMiddleware } from '../middlewares/middlewares';
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
    destination: function (req, file, cb) {
        cb(null, './subidas/logotipos');
    }
}),
    upload = multer({ storage: storage });
const rutasConfiguracion = Router();

//rutasConfiguracion.get('/logotipo', autenticacionMiddleware, ConfiguracionCtrl.obtenerLogotipo);
rutasConfiguracion.get('', autenticacionMiddleware, ConfiguracionCtrl.obtenerConfiguracionUsuario);

rutasConfiguracion.patch('/notificaciones', autenticacionMiddleware, ConfiguracionCtrl.guardarConfiguracionNotificaciones);
rutasConfiguracion.patch('/temas', autenticacionMiddleware, ConfiguracionCtrl.cambiarTema);
rutasConfiguracion.patch('/logotipo', autenticacionMiddleware, upload.single('imagen'), ConfiguracionCtrl.cambiarLogotipo);

export default rutasConfiguracion;
