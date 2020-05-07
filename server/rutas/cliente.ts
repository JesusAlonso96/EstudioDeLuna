import { Router } from 'express';
import { autenticacionMiddleware, adminOSupervisorMiddleware, adminOSupervisorORecepcionistaMiddleware } from '../middlewares/middlewares';
import * as ClienteCtrl from '../controladores/cliente';
const rutasCliente = Router();

//get
rutasCliente.get('', autenticacionMiddleware, ClienteCtrl.obtenerClientes);
rutasCliente.get('/obtenerDatosClientes', autenticacionMiddleware, ClienteCtrl.obtenerDatosClientes);
rutasCliente.get('/obtenerClientePorEmailNombre/:nombre/:email', ClienteCtrl.obtenerClienteNombreEmail);
rutasCliente.get('/obtenerPedidosCliente/:id', ClienteCtrl.obtenerPedidosCliente);
rutasCliente.get('/obtenerClientesEliminados', autenticacionMiddleware, adminOSupervisorMiddleware, ClienteCtrl.obtenerClientesEliminados);
//post
rutasCliente.post('/registrar', autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware, ClienteCtrl.registrarCliente);
//patch
rutasCliente.patch('/eliminarCliente', autenticacionMiddleware, adminOSupervisorMiddleware, ClienteCtrl.eliminarCliente);
rutasCliente.patch('/actualizarCliente', autenticacionMiddleware, adminOSupervisorMiddleware, ClienteCtrl.editarCliente);
rutasCliente.patch('/restaurarCliente', autenticacionMiddleware, adminOSupervisorMiddleware, ClienteCtrl.restaurarClienteEliminado)

export default rutasCliente;