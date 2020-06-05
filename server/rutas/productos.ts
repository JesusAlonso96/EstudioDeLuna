import { Router } from 'express';
import { autenticacionMiddleware, adminOSupervisorMiddleware } from '../middlewares/middlewares';
import * as ProductoCtrl from '../controladores/productos';
import multer from 'multer';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname + '.jpeg')
    },
    destination: function (req, file, cb) {
        cb(null, './subidas');
    }
}),
    upload = multer({ storage: storage });
const rutasProductos = Router();

rutasProductos.get('/obtenerProductos/:id', autenticacionMiddleware, ProductoCtrl.obtenerProductos);
rutasProductos.get('/obtenerProductosPorCantidad/:id', autenticacionMiddleware, ProductoCtrl.obtenerProductosPorCantidad);
rutasProductos.get('/obtenerProductosPorTam/:id', autenticacionMiddleware, ProductoCtrl.obtenerProductosPorTam);
rutasProductos.get('/familias', autenticacionMiddleware, ProductoCtrl.obtenerFamilias);
rutasProductos.get('/buscarProductoPorTam/:ancho/:alto', autenticacionMiddleware, ProductoCtrl.buscarProductoPorTam)
rutasProductos.get('/obtenerFamiliasYProductos', autenticacionMiddleware, ProductoCtrl.obtenerFamiliasYProductos)
//post
rutasProductos.post('/buscarProducto', autenticacionMiddleware, ProductoCtrl.buscarProducto);
rutasProductos.post('', autenticacionMiddleware, adminOSupervisorMiddleware, ProductoCtrl.guardarProducto);

//patch
rutasProductos.patch('/:idProducto', autenticacionMiddleware, adminOSupervisorMiddleware, upload.single('imagen'), ProductoCtrl.actualizarFotoProducto);
export default rutasProductos;