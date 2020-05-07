import {Router} from 'express';
import * as SucursalCtrl from '../controladores/sucursal';
import * as UsuarioCtrl from '../controladores/usuario';


const rutasSucursal = Router();
/* GET */
rutasSucursal.get('/:id/almacenes', UsuarioCtrl.autenticacionMiddleware, SucursalCtrl.obtenerAlmacenesSucursal);
rutasSucursal.get('', UsuarioCtrl.autenticacionMiddleware, SucursalCtrl.obtenerSucursales );
/* POST */

/* PUT */

/* PATCH */


export default rutasSucursal;