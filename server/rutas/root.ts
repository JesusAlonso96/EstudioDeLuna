import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import * as RootCtrl from '../controladores/root';

const rutasRoot = Router();

rutasRoot.get('/usuarios-sucursal', UsuarioCtrl.autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.obtenerUsuariosSinSucursal);
rutasRoot.get('/sucursales', UsuarioCtrl.autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.obtenerSucursales);

rutasRoot.post('/sucursal', UsuarioCtrl.autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.nuevaSucursal);

rutasRoot.patch('/usuarios', UsuarioCtrl.autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.asignarSucursalUsuario);

export default rutasRoot;
