import { Router } from 'express';
import * as UsuarioCtrl from '../controladores/usuario';
import * as ClienteCtrl from '../controladores/cliente';
const rutasCliente = Router();

//get
rutasCliente.get('', UsuarioCtrl.autenticacionMiddleware, ClienteCtrl.obtenerClientes);
rutasCliente.get('/obtenerDatosClientes', UsuarioCtrl.autenticacionMiddleware, ClienteCtrl.obtenerDatosClientes);
rutasCliente.get('/obtenerClientePorEmailNombre/:nombre/:email', ClienteCtrl.obtenerClienteNombreEmail);
rutasCliente.get('/obtenerPedidosCliente/:id', ClienteCtrl.obtenerPedidosCliente);
rutasCliente.get('/obtenerClientesEliminados', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, ClienteCtrl.obtenerClientesEliminados);
//post
rutasCliente.post('/registrar', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorORecepcionistaMiddleware, ClienteCtrl.registrarCliente);
//patch
rutasCliente.patch('/eliminarCliente', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, ClienteCtrl.eliminarCliente);
rutasCliente.patch('/actualizarCliente', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, ClienteCtrl.editarCliente);
rutasCliente.patch('/restaurarCliente', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, ClienteCtrl.restaurarClienteEliminado)

export default rutasCliente;