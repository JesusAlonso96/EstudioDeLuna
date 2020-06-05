import { Router } from 'express';
import * as ComprasCtrl from '../controladores/compras';
import { autenticacionMiddleware } from '../middlewares/middlewares';

const rutasCompras = Router();
/* GET */
rutasCompras.get('/sin-registrar', autenticacionMiddleware, ComprasCtrl.obtenerComprasSinRegistrar);
/* POST */

/* PUT */

/* PATCH */

export default rutasCompras;