const express = require('express'),
    ruta = express.Router(),
    Cliente = require('../controladores/cliente'),
    Empleado = require('../controladores/empleado'),
    Usuario = require('../controladores/usuario');

//get
ruta.get('', Usuario.autenticacionMiddleware, Cliente.obtenerClientes);
ruta.get('/obtenerDatosClientes', Usuario.autenticacionMiddleware, Cliente.obtenerDatosClientes);
ruta.get('/obtenerClientePorEmailNombre/:nombre/:email', Cliente.obtenerClienteNombreEmail);
ruta.get('/obtenerPedidosCliente/:id', Cliente.obtenerPedidosCliente);
ruta.get('/obtenerClientesEliminados', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Cliente.obtenerClientesEliminados);
//post
ruta.post('/registrar', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorORecepcionistaMiddleware, Cliente.registrarCliente);
//patch
ruta.patch('/eliminarCliente', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Cliente.eliminarCliente);
ruta.patch('/actualizarCliente', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Cliente.editarCliente);
ruta.patch('/restaurarCliente', Usuario.autenticacionMiddleware, Usuario.adminOSupervisorMiddleware, Cliente.restaurarClienteEliminado)
module.exports = ruta;