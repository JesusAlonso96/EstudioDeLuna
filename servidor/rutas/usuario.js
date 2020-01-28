const express = require('express'),
    ruta = express.Router(),
    Usuario = require('../controladores/usuario'),
    Admin = require('../controladores/administrador');


//get
ruta.get('/obtenerPedidosRealizadosPorFotografo/:id', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.obtenerPedidosRealizadosPorFotografo);
ruta.get('/obtenerPedidosRealizados', Usuario.autenticacionMiddleware, Usuario.obtenerPedidosRealizados);
ruta.get('/obtenerUsuarios', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.obtenerUsuarios);
ruta.get('/obtenerUsuario/:id', Usuario.autenticacionMiddleware, Usuario.obtenerUsuario);
ruta.get('/obtenerFotografos', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.obtenerFotografos);
ruta.get('/obtenerPedidosVendidos/:filtro', Usuario.autenticacionMiddleware, Usuario.obtenerPedidosVendidos);
ruta.get('/obtenerPedidosVendidosPorFotografo/:id/:filtro', Usuario.autenticacionMiddleware, Usuario.obtenerPedidosVendidosPorFotografo);
ruta.get('/obtenerVentasConRetoquePorFotografo', Usuario.autenticacionMiddleware, Usuario.obtenerVentasConRetoquePorFotografo);
ruta.get('/desglosarVentasConRetoquePorFotografo/:id', Usuario.desglosarVentasConRetoquePorFotografo);
ruta.get('/obtenerProveedores', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.obtenerProveedores);
ruta.get('/obtenerListaProveedores', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.obtenerListaProveedores);
ruta.get('/obtenerProductosProveedor/:id', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.obtenerProductosProveedor);
//post
ruta.post('/login', Usuario.login);
ruta.post('/crearAsistencia/:id', Usuario.crearAsistencia);
ruta.post('/agregarProducto', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.agregarProducto);
ruta.post('/agregarFamilia', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.agregarFamilia);
ruta.post('/nuevoProveedor', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.nuevoProveedor);
ruta.post('/agregarProductoProveedor', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.agregarProductoProveedor);
//patch
ruta.patch('/actualizarProducto', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.actualizarProducto)
ruta.patch('/eliminarProducto/:id/:idFamilia', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.eliminarProducto);
ruta.patch('/eliminarFamilia/:id', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Usuario.eliminarFamilia);



module.exports = ruta;