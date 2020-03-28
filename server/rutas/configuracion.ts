import  {Router} from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import * as ConfiguracionCtrl from '../controladores/configuracion';

const rutasConfiguracion = Router();

rutasConfiguracion.get('', UsuarioCtrl.autenticacionMiddleware, ConfiguracionCtrl.obtenerConfiguracionUsuario);

rutasConfiguracion.patch('/notificaciones', UsuarioCtrl.autenticacionMiddleware, ConfiguracionCtrl.guardarConfiguracionNotificaciones);


export default rutasConfiguracion;
