const express = require('express'),
    ruta = express.Router(),
    UsuarioCtrl = require('../controladores/usuario'),
    AdminCtrl = require('../controladores/administrador');

//get
ruta.get('/obtenerVentasDia', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasDia);
ruta.get('/obtenerVentasRango/:fechaInicio/:fechaFin', AdminCtrl.obtenerVentasRango);
ruta.get('/obtenerMasVendidos/:fechaInicio/:fechaFin', AdminCtrl.obtener10ProductosMasVendidos);
ruta.get('/obtenerVentasPorFamilia/:fechaInicio/:fechaFin', AdminCtrl.obtenerVentasPorFamilias);
ruta.get('/obtenerVentasMes/:fechaInicio/:fechaFin', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerVentasMes);
ruta.get('/existeCorte', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.existeCorte);
ruta.get('/obtenerTotalCaja', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerCaja);
ruta.get('/obtenerCortesCaja', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerCortesCaja);
ruta.get('/obtenerUsuariosEliminados', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerUsuariosEliminados);
ruta.get('/obtenerProveedoresEliminados', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerProveedoresEliminados);
ruta.get('/obtenerProductosProveedorEliminados', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.obtenerProductosProveedorEliminados);

//post
ruta.post('/empleado', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.altaUsuario);
ruta.post('/crearCorteCaja', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.crearCorteCaja);
ruta.post('/registrar', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.registrarUsuario)

//patch
ruta.patch('/actualizarCaja', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.actualizarCaja);
ruta.patch('/cambiarPermisos', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.cambiarPermisos);
ruta.patch('/restaurarUsuario', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarUsuarioEliminado);
ruta.patch('/eliminarUsuario/:id', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.eliminarUsuario);
ruta.patch('/editarUsuario', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.editarUsuario);
ruta.patch('/editarProveedor', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.editarProveedor);
ruta.patch('/eliminarProveedor', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.eliminarProveedor);
ruta.patch('/restaurarProveedorEliminado', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarProveedor);
ruta.patch('/eliminarProductoProveedor', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.eliminarProductoProveedor);
ruta.patch('/editarProductoProveedor', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.editarProductoProveedor);
ruta.patch('/restaurarProductoProveedorEliminado', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, AdminCtrl.restaurarProductoProveedorEliminado);
//delete



module.exports = ruta;