import  {Router} from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import * as ConfiguracionCtrl from '../controladores/configuracion';
import multer from 'multer';
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

//rutasConfiguracion.get('/logotipo', UsuarioCtrl.autenticacionMiddleware, ConfiguracionCtrl.obtenerLogotipo);
rutasConfiguracion.get('', UsuarioCtrl.autenticacionMiddleware, ConfiguracionCtrl.obtenerConfiguracionUsuario);

rutasConfiguracion.patch('/notificaciones', UsuarioCtrl.autenticacionMiddleware, ConfiguracionCtrl.guardarConfiguracionNotificaciones);
rutasConfiguracion.patch('/temas', UsuarioCtrl.autenticacionMiddleware, ConfiguracionCtrl.cambiarTema);
rutasConfiguracion.patch('/logotipo', UsuarioCtrl.autenticacionMiddleware, upload.single('imagen'), ConfiguracionCtrl.cambiarLogotipo);

export default rutasConfiguracion;
