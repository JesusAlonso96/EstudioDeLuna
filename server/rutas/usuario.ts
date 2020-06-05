import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import { autenticacionMiddleware, adminOSupervisorMiddleware } from '../middlewares/middlewares';
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
const rutasUsuario = Router();

//get
rutasUsuario.get('/obtenerPestanas/:rol', autenticacionMiddleware, UsuarioCtrl.obtenerPestanas);
rutasUsuario.get('/obtenerPedidosRealizadosPorFotografo/:id', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.obtenerPedidosRealizadosPorFotografo);
rutasUsuario.get('/obtenerPedidosRealizados', autenticacionMiddleware, UsuarioCtrl.obtenerPedidosRealizados);
rutasUsuario.get('/obtenerUsuarios', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.obtenerUsuarios);
rutasUsuario.get('/obtenerUsuario/:id', autenticacionMiddleware, UsuarioCtrl.obtenerUsuario);
rutasUsuario.get('/obtenerFotografos', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.obtenerFotografos);
rutasUsuario.get('/obtenerPedidosVendidos/:filtro', autenticacionMiddleware, UsuarioCtrl.obtenerPedidosVendidos);
rutasUsuario.get('/obtenerPedidosVendidosPorFotografo/:id/:filtro', autenticacionMiddleware, UsuarioCtrl.obtenerPedidosVendidosPorFotografo);
rutasUsuario.get('/obtenerVentasConRetoquePorFotografo', autenticacionMiddleware, UsuarioCtrl.obtenerVentasConRetoquePorFotografo);
rutasUsuario.get('/desglosarVentasConRetoquePorFotografo/:id', UsuarioCtrl.desglosarVentasConRetoquePorFotografo);
rutasUsuario.get('/ordenesCompra', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.obtenerOrdenesCompra);
rutasUsuario.get('/sucursales', autenticacionMiddleware, UsuarioCtrl.obtenerSucursales);
//post
rutasUsuario.post('/login', UsuarioCtrl.login);
rutasUsuario.post('/crearAsistencia/:id', UsuarioCtrl.crearAsistencia);
rutasUsuario.post('/agregarFamilia', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.agregarFamilia);
rutasUsuario.post('/ordenCompra', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.nuevaOrdenCompra);
rutasUsuario.post('/compra', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.registrarCompra)
//patch
rutasUsuario.patch('/eliminarProducto/:id/:idFamilia', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.eliminarProducto);
rutasUsuario.patch('/eliminarFamilia/:id', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.eliminarFamilia);
rutasUsuario.patch('/recuperarContrasena/:email', UsuarioCtrl.recuperarContrasena);
rutasUsuario.patch('/ordenCompra/:id', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.desactivarOrdenComra);
rutasUsuario.patch('/actualizarProducto', autenticacionMiddleware, adminOSupervisorMiddleware, UsuarioCtrl.actualizarProducto);
rutasUsuario.patch('/generarCodigoRecuperacion', UsuarioCtrl.generarCodigoRecuperacion);
rutasUsuario.patch('/eliminarCodigoRecuperacion', UsuarioCtrl.eliminarCodigoRecuperacion);
export default rutasUsuario;