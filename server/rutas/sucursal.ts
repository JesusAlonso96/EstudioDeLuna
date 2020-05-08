import {Router} from 'express';
import * as SucursalCtrl from '../controladores/sucursal';
import * as UsuarioCtrl from '../controladores/usuario';
import { autenticacionMiddleware } from '../middlewares/middlewares';


const rutasSucursal = Router();
/* GET */
rutasSucursal.get('/:id/almacenes', autenticacionMiddleware, SucursalCtrl.obtenerAlmacenesSucursal);
rutasSucursal.get('', autenticacionMiddleware, SucursalCtrl.obtenerSucursales );
/* POST */

/* PUT */

/* PATCH */


export default rutasSucursal;