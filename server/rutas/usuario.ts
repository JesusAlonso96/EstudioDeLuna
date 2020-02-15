import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';

const rutasUsuario = Router();

rutasUsuario.post('/login', UsuarioCtrl.login);
rutasUsuario.post('/crearAsistencia/:id', UsuarioCtrl.crearAsistencia);










export default rutasUsuario;