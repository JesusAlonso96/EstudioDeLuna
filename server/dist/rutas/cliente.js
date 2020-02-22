"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioCtrl = __importStar(require("../controladores/usuario"));
const ClienteCtrl = __importStar(require("../controladores/cliente"));
const rutasCliente = express_1.Router();
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
rutasCliente.patch('/restaurarCliente', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, ClienteCtrl.restaurarClienteEliminado);
exports.default = rutasCliente;
