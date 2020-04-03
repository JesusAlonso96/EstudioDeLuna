import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
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
rutasUsuario.get('/obtenerPestanas/:rol', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerPestanas);
rutasUsuario.get('/obtenerPedidosRealizadosPorFotografo/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerPedidosRealizadosPorFotografo);
rutasUsuario.get('/obtenerPedidosRealizados', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosRealizados);
rutasUsuario.get('/obtenerUsuarios', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerUsuarios);
rutasUsuario.get('/obtenerUsuario/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerUsuario);
rutasUsuario.get('/obtenerFotografos', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerFotografos);
rutasUsuario.get('/obtenerPedidosVendidos/:filtro', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosVendidos);
rutasUsuario.get('/obtenerPedidosVendidosPorFotografo/:id/:filtro', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerPedidosVendidosPorFotografo);
rutasUsuario.get('/obtenerVentasConRetoquePorFotografo', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerVentasConRetoquePorFotografo);
rutasUsuario.get('/desglosarVentasConRetoquePorFotografo/:id', UsuarioCtrl.desglosarVentasConRetoquePorFotografo);
rutasUsuario.get('/obtenerProveedores', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerProveedores);
rutasUsuario.get('/obtenerListaProveedores', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerListaProveedores);
rutasUsuario.get('/obtenerProductosProveedor/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerProductosProveedor);
rutasUsuario.get('/obtenerEmpresas', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerEmpresas);
rutasUsuario.get('/obtenerDatosEstudio', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerDatosEstudio);
rutasUsuario.get('/obtenerCotizaciones', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerCotizaciones);
rutasUsuario.get('/ordenesCompra', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.obtenerOrdenesCompra);
rutasUsuario.get('/sucursales', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.obtenerSucursales);
//post
rutasUsuario.post('/login', UsuarioCtrl.login);
rutasUsuario.post('/crearAsistencia/:id', UsuarioCtrl.crearAsistencia);
rutasUsuario.post('/agregarProducto', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.agregarProducto);
rutasUsuario.post('/agregarFamilia', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.agregarFamilia);
rutasUsuario.post('/nuevoProveedor', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.nuevoProveedor);
rutasUsuario.post('/agregarProductoProveedor', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.agregarProductoProveedor);
rutasUsuario.post('/agregarEmpresa', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.nuevaEmpresa);
rutasUsuario.post('/agregarCotizacion', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.nuevaCotizacion);
rutasUsuario.post('/ordenCompra', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.nuevaOrdenCompra);
rutasUsuario.post('/compra', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.registrarCompra)
//patch
rutasUsuario.patch('/eliminarProducto/:id/:idFamilia', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.eliminarProducto);
rutasUsuario.patch('/eliminarFamilia/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.eliminarFamilia);
rutasUsuario.patch('/recuperarContrasena/:email', UsuarioCtrl.recuperarContrasena);
rutasUsuario.patch('/ordenCompra/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.desactivarOrdenComra);
rutasUsuario.patch('/actualizarProducto', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.actualizarProducto);
rutasUsuario.patch('/eliminarEmpresa', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.eliminarEmpresa);
rutasUsuario.patch('/actualizarEmpresa', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, UsuarioCtrl.editarEmpresa);
rutasUsuario.patch('/generarCodigoRecuperacion', UsuarioCtrl.generarCodigoRecuperacion);
rutasUsuario.patch('/eliminarCodigoRecuperacion', UsuarioCtrl.eliminarCodigoRecuperacion);
export default rutasUsuario;