import { Router } from 'express';
import * as RootCtrl from '../controladores/root';
import { autenticacionMiddleware } from '../middlewares/middlewares';

const rutasRoot = Router();

rutasRoot.get('/usuarios-sucursal', autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.obtenerUsuariosSinSucursal);
rutasRoot.get('/sucursales', autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.obtenerSucursales);

rutasRoot.post('/sucursal', autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.nuevaSucursal);

rutasRoot.patch('/usuarios', autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.asignarSucursalUsuario);

export default rutasRoot;
